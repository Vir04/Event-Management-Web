import { useEffect } from 'react'
import Hero from '../components/home/Hero'
import Services from '../components/home/Services'
import Stats from '../components/home/Stats'
import FeaturedFeedbacks from '../components/home/FeaturedFeedbacks'
import CallToAction from '../components/home/CallToAction'

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <Hero />
      <Services />
      <Stats />
      <FeaturedFeedbacks />
      <CallToAction />
    </div>
  )
}

export default HomePage