import { useState } from "react";
import { Wallet, Copy, Check, Wifi, WifiOff, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface WalletComponentProps {
  className?: string;
}

export const WalletComponent = ({ className }: WalletComponentProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleCopyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected from your wallet",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className={`p-4 bg-gradient-card shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            isConnected 
              ? 'bg-wallet-connected/10 text-wallet-connected' 
              : 'bg-wallet-disconnected/10 text-wallet-disconnected'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">
                {isConnected ? "Wallet Connected" : "Wallet Disconnected"}
              </span>
              {isConnected ? (
                <Wifi className="w-4 h-4 text-wallet-connected" />
              ) : (
                <WifiOff className="w-4 h-4 text-wallet-disconnected" />
              )}
            </div>
            
            {isConnected && address && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-muted-foreground font-mono">
                  {formatAddress(address)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-wallet-connected" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </Button>
          ) : (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button 
                            onClick={openConnectModal}
                            className="bg-gradient-privacy hover:opacity-90 text-white shadow-button"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button 
                            onClick={openChainModal}
                            variant="destructive"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
      
      {isConnected && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Privacy Status</span>
            <div className="flex items-center space-x-1 text-fitness-primary">
              <div className="w-2 h-2 bg-fitness-primary rounded-full animate-pulse"></div>
              <span className="font-medium">FHE Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};