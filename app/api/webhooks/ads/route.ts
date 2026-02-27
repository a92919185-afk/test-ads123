import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Utilizando service_role_key para o backend poder dar bypass no RLS e inserir/atualizar
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface WebhookPayload {
    google_ads_account_id: string; // ID oriundo do Ads Script para ligar a conta
    account_name?: string;         // Opcional, nome da conta
    campaign_name: string;
    clicks: number;
    cost: number;
    conversion_value: number;
    date: string; // YYYY-MM-DD
}

export async function POST(req: Request) {
    try {
        // 1. Validar a API_KEY do header
        const apiKey = req.headers.get('x-api-key');
        if (!apiKey || apiKey !== process.env.WEBHOOK_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fazer o parse do payload recebido do Google Ads Script
        const data: WebhookPayload = await req.json();

        if (!data.google_ads_account_id || !data.campaign_name || !data.date) {
            return NextResponse.json({ error: 'Faltam campos essenciais no payload' }, { status: 400 });
        }

        // 3. Garantir que a Conta (Account) existe. Se não, criar
        const { data: accountData, error: accountError } = await supabaseAdmin
            .from('accounts')
            .select('id')
            .eq('google_ads_account_id', data.google_ads_account_id)
            .single();

        let accountId = accountData?.id;

        if (accountError && accountError.code === 'PGRST116') { // PGRST116: Nenhum registro retornado
            const { data: newAccount, error: createError } = await supabaseAdmin
                .from('accounts')
                .insert({
                    google_ads_account_id: data.google_ads_account_id,
                    name: data.account_name || `Conta - ${data.google_ads_account_id}`,
                })
                .select('id')
                .single();

            if (createError) throw createError;
            accountId = newAccount.id;
        } else if (accountError) {
            throw accountError;
        }

        // 4. Calcular O Lucro (Profit) Internamente e tratar números
        const cost = Number(data.cost) || 0;
        const conversion_value = Number(data.conversion_value) || 0;
        const profit = conversion_value - cost;
        const clicks = Number(data.clicks) || 0;

        // 5. Inserir ou Sobrescrever os dados no BD
        // Utiliza a chave primária UPSERT baseada na UNIQUE(account_id, campaign_name, date)
        const { error: insertError } = await supabaseAdmin
            .from('campaign_metrics')
            .upsert({
                account_id: accountId,
                campaign_name: data.campaign_name,
                clicks: clicks,
                cost: cost,
                conversion_value: conversion_value,
                profit: profit,
                date: data.date,
            }, {
                onConflict: 'account_id,campaign_name,date',
                ignoreDuplicates: false // Precisamos atualizar valores, não ignorar
            });

        if (insertError) throw insertError;

        // Retorna string ou json de sucesso pro script. Devolver o Profit calculado pode ser um bônus de log no Google
        return NextResponse.json({ success: true, profit }, { status: 200 });

    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
