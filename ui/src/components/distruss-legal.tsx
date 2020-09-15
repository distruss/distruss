import { Component } from 'inferno';
import { Helmet } from 'inferno-helmet';
import { Subscription } from 'rxjs';
import { retryWhen, delay, take } from 'rxjs/operators';
import { WebSocketService } from '../services';
import {
  GetSiteResponse,
  Site,
  WebSocketJsonResponse,
  UserOperation,
} from 'lemmy-js-client';
import { i18n } from '../i18next';
import { T } from 'inferno-i18next';
import { repoUrl, wsJsonToRes, toast } from '../utils';

interface DistrussLegalState {
  site: Site;
}

export class DistrussLegal extends Component<any, DistrussLegalState> {
  private subscription: Subscription;
  private emptyState: DistrussLegalState = {
    site: undefined,
  };
  constructor(props: any, context: any) {
    super(props, context);
    this.state = this.emptyState;
    this.subscription = WebSocketService.Instance.subject
      .pipe(retryWhen(errors => errors.pipe(delay(3000), take(10))))
      .subscribe(
        msg => this.parseMessage(msg),
        err => console.error(err),
        () => console.log('complete')
      );

    WebSocketService.Instance.getSite();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  get documentTitle(): string {
    if (this.state.site) {
      return `${i18n.t('legal')} - ${this.state.site.name}`;
    } else {
      return 'Lemmy';
    }
  }

  render() {
    return (
      <div class="container text-center">
        <Helmet title={this.documentTitle} />
<h3>Terms of Service</h3>

<h4>Agreement to the Terms</h4>
<p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and distruss.com/distruss.net, its creators or its contributors (“we”, “us”, “our”, “Distruss”), concerning your access to and use of distruss.com, distruss.net, and/or the Distruss platform. You agree that by accessing the site, you have read, understood, and agreed to be bound by the following terms.</p>
<p>If you do not agree to the following terms, you are forbidden from entering into, or otherwise using distruss.com, distruss.net and/or the Distruss platform.</p>

<h4>Age</h4>
<p>You warrant that you are at least 13 years of age. You warrant that you are at least 18 years of age, if you indicate as such in your user settings.</p>

<h4>Your Account</h4>
<p>You are solely responsible and liable for any activity that occurs under your account. You are responsible for keeping your account information up-to-date and for keeping your password secure.</p>
<p>You shall not share or misuse your access credentials. You must immediately notify us of any unauthorized uses of your account, or of any other breach of security.</p>

<h4>Liability</h4>
<p>In no event shall Distruss, or its creators or contributors be held liable for damages arising from any of the following:</p>
<ul>
  <li>Use of the distruss.com/distruss.net platform</li>
  <li>Technical failure of distruss.com/distruss.net</li>
  <li>Administrative actions performed by Distruss, including both automatic and manual actions</li>
  <li>Unauthorized access of a third party to your Distruss account</li>
  <li>Loss or breach of distruss.com/distruss.net data</li>
  <li>Force majeure</li>
</ul>
<p>You accept full liability for all content you upload to, or embed within, distruss.com, and indemnify distruss.com/distruss.net, its creators and contributors from all such liability.</p>
<p>You are responsible for everything you do with your Distruss account. Don't use distruss.com/distruss.net to store important or sensitive data.</p>

<h4>Intellectual Property</h4>
<p>You grant Distruss a permanent, worldwide, and irrevocable license to store, modify, copy, distribute, and distribute modifications of, all content that you submit to or upload to Distruss, including any creative works. Additionally, you grant Distruss a permanent, worldwide, and irrevocable license to sublicense these same rights to Distruss’ service providers. Additionally, you warrant that you are authorized to grant Distruss these rights.</p>
<p>You retain all other intellectual property rights, including ownership.</p>
<p>We need to be able to store, copy, and distribute your content, because that's just how websites like Distruss work. We also need to be able to modify it for security and formatting purposes.</p>

<h4>Your Privacy</h4>
<p>We do not share your data with anyone unless required to do so by court order within United States law. We do not honor information requests made by countries outside of the United States of America. We do not, nor do we have any intent to, aggregate data with the purpose of selling it. Distruss will make all reasonable efforts to ensure that user information is kept confidential.</p>
<p>[At our discretion, Distruss may share your information with United States law enforcement in the event of an emergency, if we have good cause to believe that doing so would avert or mitigate the emergency.]</p>

<h4>Legal Forms</h4>
<p>Distruss grants you the ability to use your Distruss account to send us certain types of legal forms through our help portal. These include, but are not limited to:</p>
<ul>
  <li>DMCA takedown request</li>
  <li>DMCA takedown counter-request</li>
  <li>Subpoenas and court orders</li>
</ul>
<p>You agree to refrain from making abusive or frivolous submissions to these forms. Additionally, you acknowledge that these forms are provided for the sake of convenience and speed, and that Distruss does not waive any of its rights regarding legal process, including the right to object for lack of proper service.</p>
<p>Distruss considers abusive and frivolous submissions to be submissions with a clear lack of legal justification. Examples include: nonsensical data, duplicate submissions, DMCA takedown requests for content that isn't your intellectual property, or legal demands from someone lacking the authority to make such a demand.</p>

<h4>Enforcement</h4>
<p>Distruss retains sole discretion in all determinations regarding content policy and terms of service violations.
Distruss reserves the right to remove content that we deem to violate content policy or the terms of service, and to deactivate accounts responsible for such violations.</p>

<h4>Severability</h4>
<p>If one clause of these Terms or the Content Policy is determined by a court to be unenforceable, the remainder of the Terms and Content Policy shall remain in force.</p>

<h4>No Implied Waiver</h4>
<p>A failure by Distruss in one or more instances to insist upon your strict adherence to these terms or the Content Policy, shall not be construed as a waiver of any continuing or subsequent violations of these terms or the Content Policy.</p>

<h4>Completeness</h4>
<p>These Terms, together with the Content Policy, contain all the terms and conditions agreed upon by you and Distruss regarding your use of the Distruss service. No other agreement, oral or otherwise, will be deemed to exist or to bind either of the parties to this Agreement.</p>

<h4>Governing Law</h4>
<p>These terms of service are governed by, and shall be interpreted in accordance with, the laws of the state of [TODO]. You consent to the jurisdiction of Hillsborough County, New Hampshire for all disputes between you and Distruss, and you consent to the application of New Hampshire law for all such disputes.</p>

<h4>Updates</h4>
<p>Distruss may periodically update these terms of service and/or the Content Policy. When this happens, Distruss will make reasonable efforts to notify you of such changes. Whenever Distruss updates these terms of service or the Content Policy, your continued use of the Distruss platform constitutes your agreement to the updated terms of service.</p>

<h3>Content Policy</h3>
<p>Here at Distruss, we believe what is stated in the First Amendment of the United States Constitution: “Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the government for a redress of grievances.”  To mitigate litigation, we have decided to host all but a few select categories of content. We do, however, allow you to host all legal categories which we do not personally host. We will then federate with you so your community will look and act as though it is part of Distruss.</p>

<h4>Content we will not currently host, but will federate with:</h4>
<ul>
  <li>Pornography, erotica, and sexually suggestive content.</li>
  <li>Piracy. Discussion about piracy is still allowed on this instance on the condition that direct download links to any pirated content aren’t posted.</li>
  <li>Doxxing, provided that the information published was obtained legally and abides by all laws of the United States.</li>
</ul>

<h4>Content we will not host, nor federate with:</h4>
<ul>
  <li>Content that is deemed illegal to host under United States law.</li>
  <li>Content advocating to ignore, break, or otherwise infringe upon a law of the United States of America.
    <ul>
      <li>Content advocating for the legalization of a law is permitted.</li>
    </ul>
  </li>
  <li>Sexual or sexually suggestive material involving an individual under the age of 18.
    <ul>
      <li>This does not apply for fictional material, such as lolicon and shotacon, which we’re willing to federate with so long as:
	    <ul>
          <li>It is not deemed “obscene” under the Miller standards</li>
          <li>It is not a depiction involving a real minor</li>
          <li>It is in compliance with the Protect Act and all other applicable US laws.</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Sexual or sexually suggestive material involving an individual that did not consent to its creation and/or distribution.</li>
</ul>

<h4>As a user of Distruss, you are not permitted to:</h4>
<ul>
  <li>Upload to, embed within, or link out from Distruss any material that violates the content policy.</li>
  <li>Cheat or engage in content manipulation (including spamming, vote manipulation, ban evasion, or subscriber fraud) or otherwise interfere with or disrupt Distruss communities.</li>
  <li>Post malicious content, including but not limited to:
    <ul>
      <li>Posts that link to phishing, viruses, etc.</li>
      <li>Posts that intentionally break or cause bugs on Distruss.</li>
      <li>If you find a problem, let us know; you’ll be making this place better for everyone.</li>
    </ul>
  </li>
  <li>Post unmarked NSFW content.</li>
  <li>Threaten or intimidate other individuals.</li>
  <li>Solicit, collect, or publish another individual's personal information illegally.</li>
  <li>Incite, plan, or execute unlawful activity.</li>
  <li>Engage in fraud.</li>
</ul>
      </div>
    );
  }

  parseMessage(msg: WebSocketJsonResponse) {
    console.log(msg);
    let res = wsJsonToRes(msg);
    if (msg.error) {
      toast(i18n.t(msg.error), 'danger');
      return;
    } else if (res.op == UserOperation.GetSite) {
      let data = res.data as GetSiteResponse;
      this.state.site = data.site;
      this.setState(this.state);
    }
  }
}
