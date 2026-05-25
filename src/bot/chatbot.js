const MENU = [
  'Welcome to the URA Tax Assistant prototype.',
  '',
  'Reply with:',
  '1 - Register or update my tax profile',
  '2 - Estimate my tax obligation',
  '3 - Check URA balance',
  '4 - Show my profile',
  '5 - Help',
].join('\n');

const BUSINESS_TYPES = {
  1: 'Retail / shop',
  2: 'Services',
  3: 'Transport',
  4: 'Restaurant / food',
  5: 'Other',
};

export function createChatbot({ userStore, taxEstimator, uraApiClient }) {
  async function handleMessage({ from, text }) {
    const message = normalize(text);
    const user = await userStore.getOrCreate(from);

    if (!message || ['hi', 'hello', 'start', 'menu'].includes(message)) {
      user.flow = null;
      await userStore.save(user);
      return MENU;
    }

    if (user.flow) {
      return continueFlow({ user, message });
    }

    if (message === '1' || message.includes('register')) {
      user.flow = { name: 'register', step: 'tin' };
      await userStore.save(user);
      return 'Please send your TIN number. Example: 1000123456';
    }

    if (message === '2' || message.includes('estimate')) {
      return estimateFor(user);
    }

    if (message === '3' || message.includes('balance')) {
      return checkUraBalance(user);
    }

    if (message === '4' || message.includes('profile')) {
      return profileFor(user);
    }

    if (message === '5' || message.includes('help')) {
      return [
        'This prototype helps you register a tax profile, estimate tax, and prepare for URA API lookup later.',
        'For now, URA balance checks use fallback mode unless API credentials are added.',
        '',
        MENU,
      ].join('\n');
    }

    return `I did not understand "${text}".\n\n${MENU}`;
  }

  async function continueFlow({ user, message }) {
    if (user.flow.name !== 'register') {
      user.flow = null;
      await userStore.save(user);
      return MENU;
    }

    if (user.flow.step === 'tin') {
      if (!/^\d{8,15}$/.test(message)) {
        return 'Please send a valid numeric TIN number, 8 to 15 digits.';
      }
      user.tin = message;
      user.flow.step = 'businessType';
      await userStore.save(user);
      return [
        'Select your business type:',
        '1 - Retail / shop',
        '2 - Services',
        '3 - Transport',
        '4 - Restaurant / food',
        '5 - Other',
      ].join('\n');
    }

    if (user.flow.step === 'businessType') {
      const businessType = BUSINESS_TYPES[message];
      if (!businessType) {
        return 'Please reply with a number from 1 to 5 for the business type.';
      }
      user.businessType = businessType;
      user.flow.step = 'turnover';
      await userStore.save(user);
      return 'What is your estimated monthly turnover in UGX? Example: 2500000';
    }

    if (user.flow.step === 'turnover') {
      const monthlyTurnover = parseMoney(message);
      if (!monthlyTurnover || monthlyTurnover < 1) {
        return 'Please enter the monthly turnover as a number. Example: 2500000';
      }
      user.monthlyTurnover = monthlyTurnover;
      user.flow.step = 'taxTypes';
      await userStore.save(user);
      return 'Which tax types apply? Reply with any of: VAT, PAYE, income tax, withholding tax. Example: VAT, income tax';
    }

    if (user.flow.step === 'taxTypes') {
      user.taxTypes = message
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      user.flow = null;
      await userStore.save(user);
      return [
        'Profile saved.',
        '',
        profileFor(user),
        '',
        'Reply 2 to estimate your tax obligation.',
      ].join('\n');
    }

    user.flow = null;
    await userStore.save(user);
    return MENU;
  }

  async function estimateFor(user) {
    if (!user.tin || !user.monthlyTurnover) {
      return 'Please register first by replying 1.';
    }

    const estimate = taxEstimator.estimate({
      monthlyTurnover: user.monthlyTurnover,
      taxTypes: user.taxTypes || [],
    });

    return [
      'Estimated tax summary:',
      `Monthly turnover: UGX ${formatMoney(user.monthlyTurnover)}`,
      `Estimated monthly obligation: UGX ${formatMoney(estimate.monthlyTax)}`,
      `Estimated annual obligation: UGX ${formatMoney(estimate.annualTax)}`,
      '',
      'This is an estimate for planning only. When URA API access is enabled, this bot will fetch official balances.',
    ].join('\n');
  }

  async function checkUraBalance(user) {
    if (!user.tin) {
      return 'Please register your TIN first by replying 1.';
    }

    const result = await uraApiClient.getTaxpayerBalance(user.tin);
    if (result.mode === 'live') {
      return [
        'URA live balance:',
        `TIN: ${user.tin}`,
        `Outstanding balance: UGX ${formatMoney(result.balance)}`,
        `Next deadline: ${result.nextDeadline || 'Not provided'}`,
      ].join('\n');
    }

    return [
      'URA API access is not active yet.',
      'For now, I can estimate your obligation from the profile you entered.',
      '',
      await estimateFor(user),
    ].join('\n');
  }

  return { handleMessage };
}

function profileFor(user) {
  if (!user.tin) {
    return 'No profile found yet. Reply 1 to register.';
  }
  return [
    'Your saved profile:',
    `TIN: ${user.tin}`,
    `Business type: ${user.businessType || 'Not set'}`,
    `Monthly turnover: ${user.monthlyTurnover ? `UGX ${formatMoney(user.monthlyTurnover)}` : 'Not set'}`,
    `Tax types: ${(user.taxTypes || []).join(', ') || 'Not set'}`,
  ].join('\n');
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function parseMoney(value) {
  return Number(String(value).replace(/[^\d.]/g, ''));
}

function formatMoney(value) {
  return Math.round(Number(value || 0)).toLocaleString('en-US');
}
