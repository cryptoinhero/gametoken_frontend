import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, LinkExternal } from '@gametoken/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
  isTokenOnly?: boolean
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
  isTokenOnly,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Total Liquidity')}:</Text>
        <Text>{totalValueFormatted}</Text>
      </Flex>
      {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>
          {TranslateString(999, `Get ${lpLabel}`, { name: lpLabel })}
        </StyledLinkExternal>
      )}
      <StyledLinkExternal href={bscScanAddress}>{TranslateString(999, 'View Contract')}</StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
