import { normalizeResponsiveValue } from '@/css'
import { ShowBalanceContextKey, Address, type Context, type RainbowKitPluginOptions, type ShowBalanceContext } from '@/types'
import { abbreviateETHBalance, isMobile } from '@/utils'
import { computed, inject, ref, toRefs,reactive, Ref, watch } from 'vue'
import { useBalance, useConfig, useReadContract } from '@wagmi/vue'
import { erc20Abi, formatUnits } from 'viem'
import { getBalance, readContract } from '@wagmi/vue/actions'

export function createRainbowKitBalanceContext(
  option: RainbowKitPluginOptions
): Context<ShowBalanceContext> {
  const { showBalance,currencyAddress } = option
  const context = ref<ShowBalanceContext>({ showBalance, currencyAddress })
  return context;
}

export function useRainbowKitBalance(address: Ref<Address| undefined>, chainId: Ref<number|undefined>) {
  const context = inject(ShowBalanceContextKey)
  if (!context)
    throw Error(`Could not find injected '${String(ShowBalanceContextKey)}' instance.`)

  const config = useConfig();
  const shouldShowBalance = computed<boolean>(() => {
    if (typeof context?.value.showBalance === 'boolean') {
      return context?.value.showBalance
    }

    if (context?.value.showBalance) {
      return (
        normalizeResponsiveValue(context.value.showBalance)[
          isMobile ? 'smallScreen' : 'largeScreen'
        ] ?? false
      )
    }
    return true
  })

  const symbol = ref<string>();
  const decimals = ref<number>();
  const value = ref<BigInt>();
  const balance = ref<string>();

  watch([address,chainId], async ([newAddress, _]) =>{
    if(!newAddress) return;
    if(context.value.currencyAddress){
      const balances = await readContract(config,{
        abi: erc20Abi,
        address: context.value.currencyAddress, 
        functionName: 'balanceOf', 
        args: [newAddress], 
      });

      const decimal = await readContract(config,{
        address: context.value.currencyAddress, 
        abi: erc20Abi, 
        functionName: 'decimals', 
      });

      const symbols = await readContract(config,{ 
        address: context.value.currencyAddress, 
        abi: erc20Abi, 
        functionName: 'symbol', 
      });

      const formattedBalance = parseFloat(formatUnits(balances, decimal));
      symbol.value = symbols;
      decimals.value = decimal;
      value.value = balances;
      balance.value = `${abbreviateETHBalance(formattedBalance)} ${symbol.value}`;
      return;
    }

    const result = await getBalance(config,{ address: newAddress });
    const formattedBalance = parseFloat(formatUnits(result.value,result.decimals));
    symbol.value = result.symbol;
    decimals.value = result.decimals;
    value.value = result.value;
    balance.value = `${abbreviateETHBalance(formattedBalance)} ${result.symbol}`;
  })

  return { shouldShowBalance, balance, symbol, decimals, value, ...toRefs(reactive(context.value)) }
}
