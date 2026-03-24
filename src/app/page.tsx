import { JSX } from 'react'
import dynamic from 'next/dynamic'

// components
import Stack from '@mui/material/Stack'
import PageLoader from '@/components/section-loader'

const HomeHero = dynamic(() => import('./_components/home-hero'), {
  loading: () => <PageLoader />,
})
const HomeAbout = dynamic(() => import('./_components/home-about'), {
  loading: () => <PageLoader />,
})
const HomeMotivation = dynamic(
  () => import('./_components/home-our-motivation'),
  {
    loading: () => <PageLoader />,
  }
)
const HomeServices = dynamic(() => import('./_components//home-services'), {
  loading: () => <PageLoader />,
})
const HomeCTA = dynamic(() => import('./_components/home-cta'), {
  loading: () => <PageLoader />,
})
const HomeContact = dynamic(() => import('./_components/home-contact'), {
  loading: () => <PageLoader />,
})

const HomePage = (): JSX.Element => {
  return (
    <Stack direction='column'>
      <div id='home-hero'>
        <HomeHero />
      </div>
      <div id='home-about'>
        <HomeAbout />
      </div>
      <div id='home-motivation'>
        <HomeMotivation />
      </div>
      <div id='home-services'>
        <HomeServices />
      </div>
      <div id='home-cta'>
        <HomeCTA />
      </div>
      <div id='home-contact'>
        <HomeContact />
      </div>
    </Stack >
  )
}

export default HomePage
