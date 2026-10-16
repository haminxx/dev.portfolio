import { Owner } from "@tomo/api";
import { Consent } from "~/components/consent";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Legal } from "~/components/legal";
import type { LegalSection } from "~/components/legal/root";

const mailto = `mailto:${Owner.Email}`;

const sections: LegalSection[] = [
	{
		heading: "The short version",
		body: (
			<>
				This is my personal site. Nothing about your visit is recorded until you choose Accept in
				the cookie banner. There are no ads, no third-party analytics scripts, and nothing is sold
				or shared. If you decline, the site still works exactly the same.
			</>
		),
	},
	{
		heading: "What is recorded after you accept",
		body: (
			<>
				For each page you open: the time, the page path, the page that referred you, your IP address
				and the approximate country, region and city it maps to, your browser, operating system and
				device type, your language, your screen size, and any campaign (utm_*) parameters in the
				link you followed. These are tied to a random id stored in a first-party cookie so repeat
				visits from the same browser group together.
			</>
		),
	},
	{
		heading: "If you sign in with Google",
		body: (
			<>
				Signing in is optional and only needed for me to reach my own dashboard. If you do sign in,
				your name, email address, profile picture and account id are stored alongside your visits.
				Nothing else is read from your Google account, and I never post anything on your behalf.
			</>
		),
	},
	{
		heading: "Cookies",
		body: (
			<>
				Two cookies relate to analytics: one records your Accept or Decline choice, and one holds
				the random visitor id — and it is only set after you accept. A session cookie is also set so
				the site can keep you signed in; that one is strictly necessary and is not used for
				analytics.
			</>
		),
	},
	{
		heading: "Where it is stored",
		body: (
			<>
				In a private Postgres database (Supabase) that only this site's server can write to and only
				I can read. Row-level security is on with no public access, and the key that reaches it
				never leaves the server. Approximate location is derived from your IP address through a free
				lookup service; the lookup receives only the IP address.
			</>
		),
	},
	{
		heading: "How long it is kept",
		body: (
			<>
				Until I no longer need it or you ask me to delete it. You can change your mind at any time
				with the control at the bottom of this page: declining stops collection immediately and
				clears the visitor id cookie.
			</>
		),
	},
	{
		heading: "Deleting your data",
		body: (
			<>
				Email me at <a href={mailto}>{Owner.Email}</a> and ask for deletion. Mention roughly when
				you visited, and your name or email if you signed in, so I can find the right rows. I will
				delete them within 30 days and reply when it is done. You can ask for a copy of what is
				stored about you the same way.
			</>
		),
	},
	{
		heading: "Contact",
		body: (
			<>
				Questions about any of this go to <a href={mailto}>{Owner.Email}</a>.
			</>
		),
	},
];

export function meta() {
	return [
		{ title: `Privacy · ${Owner.Name}` },
		{ name: "description", content: `How ${Owner.Name}'s site handles visitor data.` },
	];
}

export default function PrivacyPage() {
	return (
		<div className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-5">
			<Header.Site />
			<Legal.Root sections={sections} title="Privacy" updated="October 16, 2026" />
			<Consent.Settings />
			<div className="grow" />
			<Footer.Site />
		</div>
	);
}
