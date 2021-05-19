import React from 'react'
import { Card, CardBody, Heading } from '@gametoken/uikit'
import styled, { useTheme } from 'styled-components'
import { Timeline } from 'react-twitter-widgets'

const StyledTweetCard = styled(Card)`
  min-height: 376px;
`

const TweetCard = () => {
  const {isDark} = useTheme();
  return (
    <StyledTweetCard>
      <CardBody>
        <Heading size="lg">Latest Tweet From Gametoken</Heading>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'GameTokenFi'
          }}
          options={{
            theme: `${isDark ? 'dark' : 'light'}`,
            height: '350',
            chrome: "noheader, nofooter",
          }}
        />
      </CardBody>
    </StyledTweetCard>
  )
}

export default TweetCard
