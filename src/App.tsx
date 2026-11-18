import { Component } from '@geajs/core'
import DomainBento from './components/domains/DomainBento'
import Education from './components/education/Education'
import Hero from './components/hero/Hero'
import Journey from './components/journey/Journey'
import AppShell from './components/layout/AppShell'
import MediaWriting from './components/media/MediaWriting'
import ProofStrip from './components/proof/ProofStrip'
import SystemsLab from './components/systems/SystemsLab'
import Ventures from './components/ventures/Ventures'
import FeaturedWork from './components/work/FeaturedWork'
import Lab from './components/work/Lab'

export default class App extends Component {
  template() {
    return (
      <AppShell>
        <Hero />
        <ProofStrip />
        <DomainBento />
        <FeaturedWork />
        <Lab />
        <Journey />
        <Ventures />
        <SystemsLab />
        <Education />
        <MediaWriting />
      </AppShell>
    )
  }
}
