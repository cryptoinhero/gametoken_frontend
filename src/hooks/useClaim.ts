import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { claimTokenToV2 } from 'utils/callHelpers'
import { useClaimTokenV2Contract} from './useContract'

const useClaimToV2 = () => {
  const { account } = useWeb3React()
  const claimTokenContract = useClaimTokenV2Contract()

  const handleClaimToken = useCallback(
    async () => {
      const txHash = await claimTokenToV2(claimTokenContract, account)
      console.info(txHash)
    },
    [account, claimTokenContract],
  )

  return { onClaimToV2: handleClaimToken }
}

export default useClaimToV2
