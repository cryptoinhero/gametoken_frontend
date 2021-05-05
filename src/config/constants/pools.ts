import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.gme,
    earningToken: tokens.gme,
    contractAddress: { // masterChef contract
      97: '',
      56: '0x06F4F64a9d13cF07Ecd2Ec20aFaF7Dd0a238B599',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.075',
    sortOrder: 1,
    isFinished: false,
  },
  
]

export default pools
