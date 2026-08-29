# Kit 3 — Psychology Today profile

**Time: 30 minutes.** Paid (~CAD $40/month) and the highest-intent directory
traffic in Canadian counselling — people arrive already looking to book.

Start at [psychologytoday.com/ca/join-us](https://www.psychologytoday.com/ca/join-us).
You will need your BCACC registration number to verify.

---

## Field mapping

| Field | Value |
|---|---|
| Display name | `[COUNSELLOR NAME]` |
| Credentials shown | `MA, RCC` |
| Practice name | `Westpeak Wellness` |
| Website | `https://www.westpeakwellness.com` |
| Booking link | `https://www.westpeakwellness.com/book` |
| Primary location | Surrey, BC — then tick **Online / Telehealth only** |
| Serves | All of British Columbia |
| Languages | English, Punjabi |
| Session fee | `$140` |
| Couples fee | `$170` |
| Sliding scale | **No** — do not tick this |
| Free consultation | **Yes, 15 minutes** |
| Accepting new clients | Yes |
| Payment methods | Credit card **only** |

> **Do not tick sliding scale.** The website does not offer one, and a
> directory promising something the site does not is the kind of mismatch that
> produces an awkward first conversation.

> **Credit card only — corrected 2026-08-14.** This row said "credit card,
> e-transfer" until an audit found it contradicted the practice. All five
> Cliniko appointment types are `online_payments_mode: "required"`: the card is
> taken at the moment of booking and there is no path that ends in an
> e-transfer. Ticking e-transfer here would advertise a payment method that
> does not exist, and the person who picked the listing *because* of it finds
> out at the checkout step. The same contradiction, between the consent form
> and the live setup, is what sent 12 of 18 consent forms back incomplete.

---

## Personal statement — paste as-is

Psychology Today splits this into three prompts.

**1. "My approach" / opening**

```
Some things take a long time to explain, and they shouldn't. If you have ever
spent the first half of a session setting the scene — explaining the family
dynamic, the cultural expectation, why a decision that looks simple from
outside is not simple inside your family — you already know what that costs.

I work with adults across British Columbia by secure video, in English and
Punjabi. Anxiety, depression, trauma, burnout, and the particular weight
carried by people who are the first in their family to sit in a room like this
one. My Master's research examined intergenerational trauma in the South Asian
community, so that context is a starting point rather than something we spend
three sessions establishing.
```

**2. "What to expect"**

```
Sessions are fifty minutes, by video, from wherever you are. Early on it is
mostly you talking and me asking questions, because I would rather understand
the shape of something properly than start working quickly on the wrong part
of it.

I am fairly direct. If I think a pattern is doing something you have not named
yet, I will say so rather than wait — and you are free to tell me I have it
wrong. That exchange is the work. I will also tell you what I am doing and
why: if I suggest a particular approach, you should understand what it involves
before we start it, not afterwards.

We agree a plan and we review it. If nothing has moved after a couple of
months, that is information about the plan rather than a verdict on you, and
changing approach — or referring you to someone better suited — is a
legitimate answer.
```

**3. "Getting started"**

```
I offer a free 15-minute consultation by video. It is genuinely for working out
fit, and there is no obligation to book a session afterwards. The research is
consistent that the working relationship predicts outcomes more reliably than
the specific method does, which makes fifteen minutes a reasonable thing to
spend before committing to anything.

Registered Clinical Counsellor (RCC) with the BC Association of Clinical
Counsellors — you can verify my registration on the BCACC public register
before booking, and I would encourage you to do that with anyone.
```

---

## Specialties

**Top three** (these drive the filters — choose deliberately):

```
1. Anxiety
2. Trauma and PTSD
3. Relationship Issues
```

**Additional:**

```
Depression · Coping Skills · Family Conflict · Self Esteem · Life Transitions ·
Stress · Grief · Cultural and Systemic Oppression · Women's Issues ·
Racial Identity · Marital and Premarital · Career Counseling
```

## Modalities

```
EMDR · Cognitive Behavioral (CBT) · Gottman Method · Emotionally Focused ·
Culturally Sensitive · Trauma Focused · Internal Family Systems (IFS) ·
Mindfulness-Based (MBCT) · Narrative · Person-Centered · Somatic
```

## Client focus

```
Age: Adults (18+), Elders (65+)
Communities: Bisexual allied, Cancer allied, Immigrants allied,
             Racial justice allied, Non-binary allied, Body positivity
Faith: Sikh, Hindu, Muslim — allied (only tick what is genuinely true)
```

## Insurance wording — get this right

Psychology Today's Canadian insurance section is where practices most often
say something inaccurate. The accurate position for an RCC in BC:

```
Counselling with a Registered Clinical Counsellor is not covered by MSP.

Most BC extended health plans do cover RCC sessions — coverage typically runs
between $500 and $1,500 per year depending on the plan. Payment is taken at the
time of booking and a receipt suitable for submitting to your insurer is issued
after every session.

I do not direct-bill. Check your plan for "Registered Clinical Counsellor" or
"RCC" specifically, as some plans cover psychologists but not counsellors.
```

**That last sentence matters.** It is the single most common reason a client
discovers after three sessions that they have no coverage, and saying it up
front is both accurate and the kind of thing people remember.

## Photo

Use the same headshot as `/about` on the website. A directory photo that does
not match the site's photo is a small, real credibility cost — people do check.
Psychology Today wants a clear, well-lit, head-and-shoulders image against an
uncluttered background.

---

## When it is live

Send me the profile URL and I will set `NEXT_PUBLIC_PSYCHOLOGY_TODAY_URL`,
adding it to the site's `sameAs`. The slot is already wired.

---

**Executing this kit is estimated worth +200 points in category 50, and it
contributes to 42 (see SCORE_LEDGER.md).**
