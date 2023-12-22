import React, { useEffect } from 'react';
import supportedConnectors from '../../../constants/supportedConnectors';
import { routes, useContext } from '../../ConnectKit';
import {
  isCoinbaseWallet,
  isInjectedConnector,
  isMetaMask,
  isMetaMaskConnector,
  isOkxConnector,
  isWalletConnectConnector,
} from './../../../utils';

import { useConnect } from '../../../hooks/useConnect';

import WalletIcon from '../../../assets/wallet';
import {
  Disclaimer,
  ModalBody,
  ModalContent,
  ModalH1,
  PageContent,
} from '../../Common/Modal/styles';

import {
  ConnectorButton,
  ConnectorIcon,
  ConnectorLabel,
  ConnectorRecentlyUsed,
  ConnectorsContainer,
  InfoBox,
  InfoBoxButtons,
  LearnMoreButton,
  LearnMoreContainer,
  MobileConnectorButton,
  MobileConnectorIcon,
  MobileConnectorLabel,
  MobileConnectorsContainer,
} from './styles';

import { isAndroid, isMobile } from '../../../utils';

import { Connector } from 'wagmi';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';
import { useLastConnector } from '../../../hooks/useLastConnector';
import useLocales from '../../../hooks/useLocales';
import useDefaultWallets from '../../../wallets/useDefaultWallets';
import Button from '../../Common/Button';

const Wallets: React.FC = () => {
  const context = useContext();
  const locales = useLocales({});
  const mobile = isMobile();

  const { uri: wcUri } = useWalletConnectUri({ enabled: mobile });
  const { connectAsync, connectors } = useConnect();
  const { lastConnectorId } = useLastConnector();
  const [isOkXRendered, setIsOkXRendered] = React.useState(false);

  const openDefaultConnect = async (connector: Connector) => {
    // @TODO: use the MetaMask config
    if (isMetaMaskConnector(connector.id) && mobile) {
      const uri = isAndroid()
        ? wcUri!
        : `https://metamask.app.link/wc?uri=${encodeURIComponent(wcUri!)}`;
      if (uri) window.location.href = uri;
    } else {
      try {
        await connectAsync({ connector: connector });
      } catch (err) {
        context.displayError(
          'Async connect error. See console for more details.',
          err
        );
      }
    }
  };
  useEffect(() => {}, [mobile]);

  const openOkxConnect = async (connector: Connector) => {
    // @TODO: use the MetaMask config
    if (mobile) {
      const uri = isAndroid()
        ? wcUri!
        : `okex://main/wc?uri=${encodeURIComponent(wcUri!)}`;
      if (uri) window.location.href = uri;
    } else {
      try {
        await connectAsync({ connector: connector });
      } catch (err) {
        context.displayError(
          'Async connect error. See console for more details.',
          err
        );
      }
    }
  };

  /**
   * Some injected connectors pretend to be metamask, this helps avoid that issue.
   */

  const shouldShowInjectedConnector = () => {
    // Only display if an injected connector is detected
    const { ethereum } = window;

    const needsInjectedWalletFallback =
      typeof window !== 'undefined' &&
      ethereum &&
      !isMetaMask() &&
      !isCoinbaseWallet();
    //!ethereum?.isBraveWallet; // TODO: Add this line when Brave is supported

    return needsInjectedWalletFallback;
  };

  const wallets = useDefaultWallets();

  const findInjectedConnectorInfo = (name: string) => {
    let walletList = name.split(/[(),]+/);
    walletList.shift(); // remove "Injected" from array
    walletList = walletList.map((x) => x.trim());

    const hasWalletLogo = walletList.filter((x) => {
      const a = wallets.map((wallet: any) => wallet.name).includes(x);
      if (a) return x;
      return null;
    });
    if (hasWalletLogo.length === 0) return null;

    const foundInjector = wallets.filter(
      (wallet: any) => wallet.installed && wallet.name === hasWalletLogo[0]
    )[0];

    return foundInjector;
  };

  return (
    <PageContent style={{ width: 312 }}>
      {mobile ? (
        <>
          <MobileConnectorsContainer>
            {connectors.map((connector, index) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;
              let name = info.shortName ?? info.name ?? connector.name;

              if (isInjectedConnector(info.id)) {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name.replace(' Wallet', '');
                }
              }

              if (isWalletConnectConnector(info.id)) {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }
              //  setIsOkXRendered(true);

              return (
                <MobileConnectorButton
                  key={`m-${connector.id}-${index}`}
                  //disabled={!connector.ready}
                  onClick={() => {
                    if (isOkxConnector(connector.id)) {
                      openOkxConnect(connector);
                    } else if (
                      isInjectedConnector(info.id) ||
                      (isMetaMaskConnector(info.id) && isMetaMask())
                    ) {
                      context.setRoute(routes.CONNECT);
                      context.setConnector(connector.id);
                    } else if (isWalletConnectConnector(connector.id)) {
                      // if (name === 'Okx Wallet') {
                      //   openOkxConnect(connector);
                      // } else {
                      // }
                      context.setRoute(routes.MOBILECONNECTORS);
                    } else {
                      openDefaultConnect(connector);
                    }
                  }}
                >
                  <MobileConnectorIcon>
                    {name === 'Okx Wallet' ? (
                      <svg
                        width="1000"
                        height="1000"
                        viewBox="0 0 1000 1000"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="1000" height="1000" fill="black" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M393.949 218.518H231.049C224.129 218.518 218.519 224.128 218.519 231.048V393.948C218.519 400.869 224.129 406.479 231.049 406.479H393.949C400.87 406.479 406.48 400.869 406.48 393.948V231.048C406.48 224.128 400.87 218.518 393.949 218.518ZM581.992 406.479H419.092C412.172 406.479 406.561 412.09 406.561 419.01V581.91C406.561 588.831 412.172 594.441 419.092 594.441H581.992C588.913 594.441 594.523 588.831 594.523 581.91V419.01C594.523 412.09 588.913 406.479 581.992 406.479ZM606.974 218.518H769.874C776.794 218.518 782.405 224.128 782.405 231.048V393.948C782.405 400.869 776.794 406.479 769.874 406.479H606.974C600.053 406.479 594.443 400.869 594.443 393.948V231.048C594.443 224.128 600.053 218.518 606.974 218.518ZM393.95 594.442H231.049C224.129 594.442 218.519 600.052 218.519 606.973V769.873C218.519 776.793 224.129 782.404 231.049 782.404H393.95C400.87 782.404 406.48 776.793 406.48 769.873V606.973C406.48 600.052 400.87 594.442 393.95 594.442ZM606.974 594.442H769.874C776.794 594.442 782.405 600.052 782.405 606.973V769.873C782.405 776.793 776.794 782.404 769.874 782.404H606.974C600.053 782.404 594.443 776.793 594.443 769.873V606.973C594.443 600.052 600.053 594.442 606.974 594.442Z"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      logos.mobile ??
                      logos.appIcon ??
                      logos.connectorButton ??
                      logos.default
                    )}
                  </MobileConnectorIcon>
                  <MobileConnectorLabel>{name}</MobileConnectorLabel>
                </MobileConnectorButton>
              );
            })}
          </MobileConnectorsContainer>
          <InfoBox>
            <ModalContent style={{ padding: 0, textAlign: 'left' }}>
              <ModalH1 $small>{locales.connectorsScreen_h1}</ModalH1>
              <ModalBody>{locales.connectorsScreen_p}</ModalBody>
            </ModalContent>
            <InfoBoxButtons>
              {!context.options?.hideQuestionMarkCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ABOUT)}
                >
                  {locales.learnMore}
                </Button>
              )}
              {!context.options?.hideNoWalletCTA && (
                <Button
                  variant={'tertiary'}
                  onClick={() => context.setRoute(routes.ONBOARDING)}
                >
                  {locales.getWallet}
                </Button>
              )}
            </InfoBoxButtons>
          </InfoBox>
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      ) : (
        <>
          <ConnectorsContainer>
            {connectors.map((connector) => {
              const info = supportedConnectors.filter(
                (c) => c.id === connector.id
              )[0];
              if (!info) return null;

              let logos = info.logos;

              let name = info.name ?? connector.name;
              if (isWalletConnectConnector(info.id)) {
                name =
                  context.options?.walletConnectName ?? locales.otherWallets;
              }

              if (isInjectedConnector(info.id)) {
                if (!shouldShowInjectedConnector()) return null;

                const foundInjector = findInjectedConnectorInfo(connector.name);
                if (foundInjector) {
                  logos = foundInjector.logos;
                  name = foundInjector.name;
                }
              }

              let logo = logos.connectorButton ?? logos.default;
              if (info.extensionIsInstalled && logos.appIcon) {
                if (info.extensionIsInstalled()) {
                  logo = logos.appIcon;
                }
              }
              return (
                <ConnectorButton
                  key={connector.id}
                  disabled={context.route !== routes.CONNECTORS}
                  onClick={() => {
                    context.setRoute(routes.CONNECT);
                    context.setConnector(connector.id);
                  }}
                >
                  <ConnectorIcon>{logo}</ConnectorIcon>
                  <ConnectorLabel>
                    {name}
                    {!context.options?.hideRecentBadge &&
                      lastConnectorId === connector.id && (
                        <ConnectorRecentlyUsed>
                          <span>Recent</span>
                        </ConnectorRecentlyUsed>
                      )}
                  </ConnectorLabel>
                </ConnectorButton>
              );
            })}
          </ConnectorsContainer>

          {!context.options?.hideNoWalletCTA && (
            <LearnMoreContainer>
              <LearnMoreButton
                onClick={() => context.setRoute(routes.ONBOARDING)}
              >
                <WalletIcon /> {locales.connectorsScreen_newcomer}
              </LearnMoreButton>
            </LearnMoreContainer>
          )}
          {context.options?.disclaimer && (
            <Disclaimer style={{ visibility: 'hidden', pointerEvents: 'none' }}>
              <div>{context.options?.disclaimer}</div>
            </Disclaimer>
          )}
        </>
      )}
    </PageContent>
  );
};

export default Wallets;
