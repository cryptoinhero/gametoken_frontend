import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { Toast, toastTypes } from '@gametoken/uikit'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import { getWeb3NoAccount } from 'utils/web3'
import { getBalanceNumber } from 'utils/formatBalance'
import useRefresh from 'hooks/useRefresh'
import tokens from 'config/constants/tokens';
import { gql, useQuery } from '@apollo/client'
import { getAddress } from 'utils/addressHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  setBlock,
} from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, AchievementState, PriceState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices, updatePriceList } from './prices'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()

  const allPriceQuery = gql`{
    tokens(orderBy: tradeVolumeUSD orderDirection: desc first: 1000) {
      id
      symbol
      name
      derivedBNB: derivedETH
      tokenDayData(orderBy: date orderDirection: desc, first: 1) {
        id
        dailyTxns
        priceUSD
      }
    }
  }`
  const {data} = useQuery(allPriceQuery)
  
  useEffect(() => {
    if(data) dispatch(updatePriceList(data))
  }, [dispatch, data, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (token: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[token.toLowerCase()]
}

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 2 // GME-BNB LP
  const gmePriceUSD = usePriceCakeBusd();
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? gmePriceUSD.div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const pid = 1 // GME-BUSD LP
  const gmeBusdFarm = useFarmFromPid(pid);
  const cakeBusdPrice = gmeBusdFarm.tokenPriceVsQuote ?  new BigNumber(1).div(gmeBusdFarm.tokenPriceVsQuote) : ZERO
  return cakeBusdPrice
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const gmePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const prices = useGetApiPrices()
  
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let quoteTokenPriceUsd = prices && prices[getAddress(farm.quoteToken.address).toLowerCase()] ? prices[getAddress(farm.quoteToken.address).toLowerCase()] : 1
      if(farm.quoteToken === tokens.gme) quoteTokenPriceUsd = gmePrice.toNumber();
      if (!quoteTokenPriceUsd) quoteTokenPriceUsd = 0

      let tokenPriceUsd = prices && prices[getAddress(farm.token.address).toLowerCase()] ? prices[getAddress(farm.token.address).toLowerCase()] : 1
      if(farm.token === tokens.gme) tokenPriceUsd = gmePrice.toNumber();
      if(!tokenPriceUsd) tokenPriceUsd = 0
        
      const totalLiquidity = farm.isTokenOnly ? new BigNumber(farm.tokenAmount).times(tokenPriceUsd) : new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
      value = value.plus(totalLiquidity);
    }
  }

  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()

  for(let i = 0; i < pools.length; i++) {
    const pool = pools[i]
    if(pool.totalStaked || pool.isFinished || currentBlock > pool.endBlock) {
      let val;
      if (pool.stakingToken === tokens.wbnb) {
        val = (bnbPrice.times(getBalanceNumber(pool.totalStaked)));
      }else if (pool.stakingToken === tokens.gme) {
        val = (gmePrice.times(getBalanceNumber(pool.totalStaked)));
      }else{
        val = (pool.totalStaked);
      }
      value = value.plus(val)
    }
  }

  return value;
}
