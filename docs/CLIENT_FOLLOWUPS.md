# Client follow-up drafts — for the owner to read, adjust and send by hand

Written 1 October 2026. Three messages the practice sends often enough that
composing each one from nothing, at whatever hour, is where the one-business-
day reply promise slips. They are drafts. Nothing in this file is sent by any
script, cron or button; each is pasted into a reply from the counsellor's own
mailbox after being read.

Why these three: the funnel survey of the same day found the automatic mail
covers booked consultations (confirmation, reminder, the day-after note) and
lead-magnet subscribers (the nurture sequence). It does not cover the three
places a person falls out between asking and paying: they asked a question
and got an answer but no next step; they booked a consultation and cancelled
it; they had the consultation and did not book. Each of those is a person who
has already done the hard part.

Rules carried from `lib/booking-mail.ts` and `lib/reply-templates.ts`, which
are the house style and are not optional:

- Answer the question that was asked, first.
- Nothing clinical over email. The inbox may be shared, on a lock screen, or
  read by someone else in the house. No presenting concern, no service name
  beyond "counselling", nothing about what was said on a call.
- No review or testimonial solicitation, ever (BCACC).
- No outcome claims, no "you will feel better", nothing predictive.
- No urgency, no scarcity, no "spots are filling". Saying no is a normal
  outcome and the message should make that visible, not merely permitted.
- Email over phone. Offer a reply, not a call.
- The free consultation is 15 minutes (owner decision, 3 Oct 2026; Cliniko
  is switched to match). If it changes again, these drafts change.
- Coverage is plan-dependent. Never "your insurance will cover this".
- The founder is not offered as the person they will see.
- One message each. None of these is the first of a sequence, and each says
  so where it matters.

Replace every `[bracket]` before sending. Where the draft says "I", it is the
counsellor who will see the person, writing as themselves.

---

## 1. Reply to an enquiry that asked for information

**When:** someone wrote through the site or by email asking a factual
question — fees, whether a plan covers it, whether the counsellor works in
Punjabi or Tagalog, whether evenings exist, what the consultation involves —
and did not ask to book. The `book` template in `lib/reply-templates.ts`
assumes they are ready; this one assumes they are deciding.

**Subject:** Re: your question about [fees / coverage / language / the consultation]

Hi [first name],

[Answer the question in one to three sentences, plainly, before anything
else. Examples, pick the one that fits and delete the rest:]

[Fees:] A 50-minute individual session is $[fee] and a couples session is
$[fee]; GST does not apply to counselling. Everything is on
https://www.westpeakwellness.com/pricing, and there is no package or
minimum number of sessions.

[Coverage:] Whether a plan reimburses depends on the plan your employer
bought rather than the insurer's name, so I cannot promise it, but many BC
extended health plans that list a Registered Clinical Counsellor do. The
quickest check is the paramedical section of your benefits booklet, or the
number on your card, asking: "Does my plan reimburse a Registered Clinical
Counsellor, RCC, in BC?" The exact words to use are here:
https://www.westpeakwellness.com/resources/does-my-plan-cover-counselling-bc

[Language:] Yes. I work in [Punjabi / Tagalog] and English, in the language
itself rather than through an interpreter, and you can switch between them
in a session if that is what feels natural.

[Times:] Times depend on the counsellor; the calendar at
the link below shows what is actually open this week, which is more reliable
than anything I could type here.

[The consultation:] It is a free 15-minute conversation by secure video.
You say what is going on in your own words, ask whatever you want to ask,
and we work out together whether this is the right fit. Nothing is diagnosed
and nothing is decided on the call.

If it would help to talk it through before deciding anything, the free
15-minute consultation is here, and it carries no obligation:
https://www.westpeakwellness.com/book

If you would rather keep reading first, these answer the questions people
ask most:
https://www.westpeakwellness.com/answers

And if the answer to your question means this is not the right place, that
is a useful thing to have found out by email rather than in a first session.
If you tell me roughly what you are looking for, I will point you somewhere
that fits.

[Name]
Registered Clinical Counsellor, Westpeak Wellness
info@westpeakwellness.com

*Notes for the owner:* if the enquiry mentions anything that sounds urgent,
the `urgent` template goes first and this one waits. If the question is
about a counsellor who is not accepting clients, say so in one line rather
than swapping the name silently (DECISIONS.md, "Insurance is data on the
roster").

---

## 2. Rebook note after a cancelled consultation

**When:** the booking job has alerted the practice that a consultation was
cancelled (`lib/booking-notify.ts`, cancellation alerts added 28 Sep 2026)
and nothing else has arrived from the person. Send once, a day or two after
the cancellation, not the same hour. Never send if the person cancelled and
rebooked already, and never send a second one.

Cancellations are mostly life: a shift changed, a child was sick, the
courage ran out that morning. A message that treats it as a lost sale reads
wrong to all three. This one treats it as a thing that happened.

**Where the draft is now (1 October 2026):** the text lives in
`lib/reply-templates.ts` (`BOOKING_DRAFTS`, key `rebook-consult`), so there
is one copy. The cancellation alert for a consultation carries a "Draft a
rebook note" link that opens it in a mail client with the first name, the
day and that counsellor's free calendar (`/book?with=<slug>#calendar`)
already filled in, signed with her name. Read it, change what needs
changing, and send it a day later from your own mailbox. Paid cancellations
carry no draft.

**Subject:** Whenever suits | Westpeak Wellness

*Notes for the owner:* the subject line carries no name and no word
"cancelled", because the subject is what shows on a lock screen. If the
cancellation came from the practice's side (counsellor unavailable), use a
different first line that says so and apologises, and offer the first two
open times in the body.

---

## 3. Note after a consultation with no booking

**When:** the automatic day-after note (`consultFollowUpEmail`) has gone, and
roughly two weeks have passed with no session booked. That automatic note
says "this is the only message of its kind", so this one cannot be a second
nudge about booking. It is a different message: it answers the question that
most often stops people after a good call, and it holds the door open
without leaning on it. Send once. If there is still nothing after this,
there is nothing to send.

**Where the draft is now (1 October 2026):** the text lives in
`lib/reply-templates.ts` (`BOOKING_DRAFTS`, key `after-consult`). The
booking job (`lib/booking-notify.ts`) now finds these people: a
consultation whose day-after note went out 10 to 14 days ago, with no later
session booked that was not cancelled. It sends a notice to info@ and to
that counsellor's own address, once per client ever, carrying the draft as
a mailto: with the first name, the day and her own paid calendar filled
in. Nothing goes to the client automatically; she edits it and sends it, or
leaves it. When the counsellor is not taking new clients the notice carries
no draft and says the `full` reply is the honest one.

**Subject:** One more thing, then I will leave it with you | Westpeak Wellness

*Notes for the owner:* nothing from the call goes in this email, including
the reason they came. If the person asked on the call about a different
counsellor or a different language, this message should name the right
person's booking link, not the sender's. If the consultation was with a
counsellor who has since stopped accepting clients, this message is not
sent; the `full` template is the honest one.

---

## What to watch

`/admin` shows reply times once five answered messages carry a timestamp
(`replyTimeStats` in `lib/reply-templates.ts`). The booking alerts show
whether a cancelled consultation was rebooked. If these three drafts earn
their place, the sign is a consultation booked within a week of message 1 or
2, and a paid session within two weeks of message 3; if six weeks of sending
shows neither, they are not working and should be rewritten, not sent harder.
