import { WalletProps } from '../wallet';

import { isAndroid } from '../../utils';
import Logos from '../../assets/logos';

export const okx = (): WalletProps => {
  return {
    id: 'okx',
    name: 'OkX Wallet',
    logos: {
      default: <Logos.OKX />,
    },
    logoBackground: '#fff',
    scannable: false,
    downloadUrls: {
      android:
        'https://play.google.com/store/apps/details?id=com.okinc.okex.gp',
      ios: 'https://itunes.apple.com/app/id1327268470?mt=8',
      mobile: 'https://okx.com/download',
      qrCode: 'https://okx.com/download',
      chrome:
        'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/okx-wallet/pbpjkcldjiffchgbbndmhojiacbgflha',
      firefox: 'https://addons.mozilla.org/firefox/addon/okexwallet/',
      browserExtension: 'https://okx.com/download',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://okx.com/download/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
