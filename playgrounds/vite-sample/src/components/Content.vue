<script setup lang="ts">
import {
  useModalContext,
  ConnectButton,
  useRainbowKitAccountContext,
  WalletButton,
  useLocale,
  useThemeContext,
} from "use-rainbowkit-vue";
import { useSendTransaction, useSignMessage, useSignTypedData } from "@wagmi/vue";
import { Address, parseEther } from "viem";

const { openConnectModal, openAccountModal, openChainModal, connectModalOpen, accountModalOpen, chainModalOpen } = useModalContext();
const { connectionStatus,address, isConnected, chainId } = useRainbowKitAccountContext();
const { changeLocale } = useLocale();
const { changeTheme } = useThemeContext();
const {
    data: transactionData,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction();

  const {
    data: signingData,
    error: signingError,
    signMessage,
  } = useSignMessage();

  const {
    data: typedData,
    error: typedError,
    signTypedData,
  } = useSignTypedData();

</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
    }">
    <h2 :style="{ textTransform: 'uppercase', marginTop: 0 }" v-if="address">
      Rainbowkit Vue Example - {{ connectionStatus }}
    </h2>
    <h2 :style="{ textTransform: 'uppercase', marginTop: 0 }" v-else>
      Rainbowkit Vue Example - {{ connectionStatus }}
    </h2>
    <table class="card">
      <thead>
        <tr>
          <th width="25%">Title</th>
          <th width="30%">Action 1</th>
          <th width="25%">Action 2</th>
          <th width="25%">Action 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td width="25%">Custom / Connect Buttons</td>
          <td>
            <ConnectButton />
          </td>
          <td>
            <ConnectButton>
              <template v-slot:custom="data">
                <div 
                  :aria-hidden="true" 
                  :style="{ 
                    display: 'flex'
                  }">

                  <button 
                    type="button"
                    @click="openConnectModal"
                    v-if="(data.account === undefined && data.connectionStatus === 'disconnected')"
                    :style="{ background: 'blue', color: 'white', marginRight: '8px' }">
                    Connect Wallet
                  </button>

                  <button v-if="data.chain?.unsupported">
                    Wrong network
                  </button>

                  <div :style="{ display: 'flex', gap:'12px' }">
                    <button 
                      @click="openChainModal"
                      :style="{ alignItems: 'center', display: 'flex', background: 'black', color: 'white' }"
                      type="button"
                      v-if="!data.chain?.shouldHideChainButton">
                      <div
                        :style="{
                          background: data.chain?.iconBackground,
                          borderRadius: 999,
                          height: '24px',
                          width: '24px',
                          marginRight: '8px',
                          overflow: 'hidden',
                        }" v-if="data.chain?.hasIcon">
                        <img :alt="data.chain.name ?? 'chain icon'" :src="data.chain.iconUrl" :style="{ height: '24px', width: '24px' }" v-if="data.chain.hasIcon"/>
                      </div>
                      {{ data.chain?.name ?? data.chain?.id }}
                    </button>
                    <button @click="openAccountModal" type="button" v-if="data.account">
                      {{ data.account?.displayName }} {{ data.account?.displayBalance ? ` ${data.account.balance}` : '' }}
                    </button>
                  </div>
                </div>
              </template>
            </ConnectButton>
          </td>
          <td>
            <div :style="{ display: 'flex' }">
            <button
              @click="()=>changeLocale('en')"
              :style="{
                backgroundColor: 'blue',
                color: 'white',
                width: '70%',
                marginRight: '8px'
              }"
            >
              Change Language
            </button>

            <button
              @click="()=>changeTheme('dark')"
              :style="{
                backgroundColor: 'red',
                color: 'white',
                width: '70%',
              }"
            >
              Change Theme
            </button>
          </div>
          </td>
        </tr>
        <tr>
          <td width="25%">Wallet Buttons</td>
          <td>
            <WalletButton wallet="rainbow"/>
          </td>
          <td>
            <WalletButton wallet="metamask"/>
          </td>
          <td>
            <WalletButton wallet="coinbase"/>
          </td>
        </tr>
        <tr>
          <td width="25%">Modal Hooks</td>
          <td>
            <button
              @click="openConnectModal"
              :disabled="connectModalOpen || connectionStatus === 'connected'"
              :style="{
                backgroundColor: 'red',
                color: 'white',
                width: '70%',
              }"
            >
              {{ connectModalOpen ? 'Connect Modal Opened' : 'Open Connect Modal' }}
            </button>
          </td>
          <td>
            <button
              @click="openAccountModal"
              :style="{
                backgroundColor: 'black',
                color: 'white',
                width: '70%',
              }"
              :disabled="connectionStatus === 'disconnected' || accountModalOpen"
            >
            {{ accountModalOpen ? 'Account Modal Opened' : 'Open Account Modal' }}
            </button>
          </td>
          <td>
            <button
              @click="openChainModal"
              :style="{
                backgroundColor: 'blue',
                color: 'white',
                width: '70%',
              }"
              :disabled="chainModalOpen"
            >
            {{ chainModalOpen ? 'Chain Modal Opened' : 'Open Chain Modal' }}
            </button>
          </td>
        </tr>
        <tr>
          <td width="25%">Example Actions</td>
          <td>
            <button
              @click="()=> sendTransaction({to: address as Address, value: parseEther('0.001')})"
              :disabled="!sendTransaction || !isConnected"
              :style="{
                backgroundColor: 'red',
                color: 'white',
                width: '70%',
              }"
            >
              Send Transaction
            </button>
            <div>
              <div v-if="transactionData">
                <div :style="{ wordBreak: 'break-all'}">
                  Transaction: {{ JSON.stringify(transactionData) }}
                </div>
              </div>
              <div v-else-if="transactionError">
                Error signing message
              </div>
            </div>
          </td>
          <td>
            <button
              :disabled="!isConnected"
              :style="{
                backgroundColor: 'black',
                color: 'white',
                width: '70%',
              }"
              @click="()=> signMessage({ message: 'Buy RainbowKit Token' })">
              Sign Message
            </button>
            <div>
              <div v-if="signingData">
                <div :style="{ wordBreak: 'break-all'}">
                  Data Signature: {{ signingData }}
                </div>
              </div>
              <div v-else-if="signingError">
                Error signing message
              </div>
            </div>
          </td>
          <td>
            <button
              :disabled="!isConnected || chainId !== 1"
              :style="{
                backgroundColor: 'blue',
                color: 'white',
                width: '70%',
              }"
              @click="()=> signTypedData({
                    domain: {
                      chainId: 1,
                      name: 'Ether Mail',
                      verifyingContract:
                        '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                      version: '1',
                    },
                    message: {
                      contents: 'Hello, RainbowKit!',
                      from: {
                        name: 'Superman',
                        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                      },
                      to: {
                        name: 'Batman',
                        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                      },
                    },
                    primaryType: 'Mail',
                    types: {
                      Mail: [
                        { name: 'from', type: 'Person' },
                        { name: 'to', type: 'Person' },
                        { name: 'contents', type: 'string' },
                      ],
                      Person: [
                        { name: 'name', type: 'string' },
                        { name: 'wallet', type: 'address' },
                      ],
                    },
                  })"
            >
              Sign Typed Data
            </button>
            <div>
              <div v-if="typedData">
                <div :style="{ wordBreak: 'break-all'}">
                  Typed Data Signature: {{ typedData }}
                </div>
              </div>
              <div v-if="typedError">
                Error signing typed message
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.card {
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
}

.card td,
.card th {
  border: 1px solid #ddd;
  padding: 8px;
}

.card tr {
  text-align: center;
}

.card tr:nth-child(even) {
  background-color: #f2f2f2;
}

.card tr:hover {
  background-color: #ddd;
}

.card th {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #04aa6d;
  color: white;
}

.card th:first-child {
  -moz-border-radius: 6px 0 0 0;
  -webkit-border-radius: 6px 0 0 0;
  border-radius: 6px 0 0 0;
}

.card th:last-child {
  -moz-border-radius: 0 6px 0 0;
  -webkit-border-radius: 0 6px 0 0;
  border-radius: 0 6px 0 0;
}

.card th:only-child {
  -moz-border-radius: 6px 6px 0 0;
  -webkit-border-radius: 6px 6px 0 0;
  border-radius: 6px 6px 0 0;
}

.card tr:last-child td:first-child {
  -moz-border-radius: 0 0 0 6px;
  -webkit-border-radius: 0 0 0 6px;
  border-radius: 0 0 0 6px;
}

.card tr:last-child td:last-child {
  -moz-border-radius: 0 0 6px 0;
  -webkit-border-radius: 0 0 6px 0;
  border-radius: 0 0 6px 0;
}
</style>
