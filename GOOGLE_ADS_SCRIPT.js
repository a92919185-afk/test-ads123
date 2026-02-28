/**
 * AdsMaster - Google Ads Ingestion Script
 * Este script deve ser colado dentro do seu Google Ads (Ferramentas > Scripts).
 * Ele percorre todas as campanhas ativas e envia as métricas de hoje para o seu Dashboard.
 */

const CONFIG = {
    WEBHOOK_URL: 'https://adsmaster-s4u5.vercel.app/api/webhooks/ads',
    API_KEY: '681049',
    ACCOUNT_ID: AdsApp.currentAccount().getCustomerId()
};

function main() {
    const today = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');

    const campaignIterator = AdsApp.campaigns()
        .withCondition('Status = ENABLED')
        .get();

    Logger.log('Iniciando envio de dados para a conta: ' + CONFIG.ACCOUNT_ID);

    while (campaignIterator.hasNext()) {
        const campaign = campaignIterator.next();
        const stats = campaign.getStatsFor('TODAY');

        const payload = {
            google_ads_account_id: CONFIG.ACCOUNT_ID,
            account_name: AdsApp.currentAccount().getName(),
            campaign_name: campaign.getName(),
            budget: campaign.getBudget().getAmount(),
            status: campaign.getStatus(),
            impressions: stats.getImpressions(),
            clicks: stats.getClicks(),
            cost: stats.getCost(),
            conversions: stats.getConversions(),
            conversion_value: stats.getConversionValue(),
            date: today
        };

        sendData(payload);
    }
}

function sendData(payload) {
    const options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
            'x-api-key': CONFIG.API_KEY
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    try {
        const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
        Logger.log('Campanha: ' + payload.campaign_name + ' | Resposta: ' + response.getContentText());
    } catch (e) {
        Logger.log('Erro ao enviar campanha: ' + payload.campaign_name + ' | Erro: ' + e.toString());
    }
}
