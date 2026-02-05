import dotenv from 'dotenv';
import paytm from 'paytmchecksum';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const testPaytmConfig = () => {
    console.log('Testing Paytm Configuration...\n');
    
    // Check required environment variables
    const requiredVars = [
        'PAYTM_MID',
        'PAYTM_MERCHANT_KEY',
        'PAYTM_WEBSITE',
        'PAYTM_CHANNEL_ID',
        'PAYTM_INDUSTRY_TYPE',
        'PAYTM_CUST_ID'
    ];
    
    const missingVars = [];
    const presentVars = [];
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            presentVars.push(varName);
            console.log(`✓ ${varName}: ${varName === 'PAYTM_MERCHANT_KEY' ? '***HIDDEN***' : process.env[varName]}`);
        } else {
            missingVars.push(varName);
            console.log(`✗ ${varName}: NOT SET`);
        }
    });
    
    console.log(`\nSummary:`);
    console.log(`Present: ${presentVars.length}/${requiredVars.length}`);
    console.log(`Missing: ${missingVars.length}`);
    
    if (missingVars.length > 0) {
        console.log(`\nMissing variables: ${missingVars.join(', ')}`);
        console.log('\nPlease set these variables in backend/config/config.env');
        return false;
    }
    
    // Test checksum generation
    console.log('\nTesting checksum generation...');
    const testParams = {
        MID: process.env.PAYTM_MID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
        ORDER_ID: 'TEST_ORDER_123',
        CUST_ID: process.env.PAYTM_CUST_ID,
        TXN_AMOUNT: '100',
        CALLBACK_URL: 'http://localhost:4000/api/v1/callback',
        EMAIL: 'test@example.com',
        MOBILE_NO: '9999999999',
    };
    
    try {
        const checksum = paytm.generateSignature(testParams, process.env.PAYTM_MERCHANT_KEY);
        console.log('✓ Checksum generation successful');
        console.log('✓ Paytm configuration appears to be working');
        return true;
    } catch (error) {
        console.log('✗ Checksum generation failed:', error.message);
        return false;
    }
};

testPaytmConfig();