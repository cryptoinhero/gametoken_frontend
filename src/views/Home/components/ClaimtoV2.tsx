import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardBody, Heading, Text } from '@gametoken/uikit'
import styled from 'styled-components'
import useTokenBalance from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress, getClaimV2Address } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { useClaimV2Approve } from 'hooks/useApprove'
import useClaimToV2 from 'hooks/useClaim'
import { useCake } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import useRefresh from 'hooks/useRefresh'


const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  grid-column: span 12 !important;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`
const Actions = styled.div`
  margin-top: 24px;
`

const ClaimtoV2 = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedClaim, setRequestedClaim] = useState(false)
  const [allowance, setAllowance] = useState(new BigNumber(0))
  
  const { fastRefresh } = useRefresh()

  const gmeBalance = useTokenBalance(getCakeAddress())
  const isApproved = account && allowance && allowance.isGreaterThan(gmeBalance)
  
  const gmeContract = useCake()
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const response = await gmeContract.methods.allowance(account, getClaimV2Address()).call()
      setAllowance(new BigNumber(response))
    }

    if(account) {
      checkApprovalStatus()
    }
  }, [account, gmeContract, fastRefresh])

  const { onApprove } = useClaimV2Approve()
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const { onClaimToV2 } = useClaimToV2()
  const handleClaimV2 = useCallback( async () => {
    try {
      setRequestedClaim(true)
      await onClaimToV2()
    } catch (e) {
      console.log(e)
    }
    setRequestedClaim(false)
  }, [onClaimToV2])

  const renderApprovalOrClaimButton = () => {
    return isApproved ? (
      <Button mt="8px" width="100%" disabled={requestedClaim || gmeBalance.isLessThanOrEqualTo(0)} onClick={handleClaimV2}>
        {TranslateString(758, 'Claim GME to V2')}
      </Button>
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(758, 'Approve Contract')}
      </Button> 
    )
  }

  return (
    <StyledCakeStats> 
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(534, 'Claim to GME v2')}
        </Heading>
        <Row>
          <Text fontSize="14px">{TranslateString(536, 'Claim description')}</Text>
        </Row>
        { gmeBalance.isGreaterThan(0) &&
          <Row>
          <Actions>
              {!account ? <UnlockButton mt="8px" width="100%" /> : renderApprovalOrClaimButton()}
          </Actions>
          </Row>
        }
      </CardBody>
    </StyledCakeStats>
  )
}

export default ClaimtoV2
