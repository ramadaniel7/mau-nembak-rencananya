import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Send } from 'lucide-react';
import { config } from '../data/config';
import { content } from '../data/content';
import { buildWhatsAppUrl, isNumberConfigured } from '../utils/whatsapp';

interface Props {
  /** WhatsApp was opened (or its link tapped) — remember it so a returning visitor sees the thank-you */
  onHandoff: () => void;
  /** visitor chose to continue to the final screen */
  onContinue: () => void;
}

type Status = 'idle' | 'sending' | 'ready';

const MAX = { name: 40, wish: 500, message: 600 };

/** Small envelope that closes and flies away while the message is being prepared. */
function SendingEnvelope({ reduced }: { reduced: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 120 90"
      width="150"
      height="112"
      aria-hidden="true"
      initial={{ y: 10, opacity: 0 }}
      animate={reduced ? { y: 0, opacity: 1 } : { y: [10, 0, 0, -26], opacity: [0, 1, 1, 1] }}
      transition={{ duration: reduced ? 0.3 : 1.7, times: reduced ? undefined : [0, 0.25, 0.7, 1], ease: 'easeInOut' }}
    >
      <rect x="6" y="18" width="108" height="66" rx="8" fill="#F8C8D4" />
      <motion.rect
        x="18"
        y="26"
        width="84"
        height="44"
        rx="4"
        fill="#FFF9F7"
        initial={{ y: -22 }}
        animate={{ y: 0 }}
        transition={{ duration: reduced ? 0.1 : 0.8, delay: reduced ? 0 : 0.25 }}
      />
      <path d="M6 26 L60 62 L114 26 L114 84 Q114 84 108 84 L12 84 Q6 84 6 78 Z" fill="#FCE4EC" />
      <motion.polygon
        points="6,26 60,62 114,26"
        fill="#F4A7B9"
        style={{ transformBox: 'fill-box', transformOrigin: 'top' }}
        initial={{ scaleY: -1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: reduced ? 0.1 : 0.7, delay: reduced ? 0 : 0.9, ease: 'easeInOut' }}
      />
      <text x="60" y="52" textAnchor="middle" fontSize="16" fill="#B76E85">
        ♥
      </text>
    </motion.svg>
  );
}

export default function WishForm({ onHandoff, onContinue }: Props) {
  const reduced = !!useReducedMotion();
  const [name, setName] = useState(config.recipient.firstName);
  const [wish, setWish] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; wish?: string; form?: string }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [blocked, setBlocked] = useState(false);
  const urlRef = useRef('');
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = content.wish.errors.name;
    if (wish.trim().length < 2) next.wish = content.wish.errors.wish;
    if (!isNumberConfigured()) next.form = content.wish.errors.number;
    setErrors(next);
    if (Object.keys(next).length) return;

    urlRef.current = buildWhatsAppUrl({
      name: name.trim(),
      answer: 'YES',
      wish: wish.trim(),
      message: message.trim(),
    });
    setStatus('sending');
    setBlocked(false);

    timer.current = window.setTimeout(() => {
      const w = window.open(urlRef.current, '_blank');
      if (w) {
        w.opener = null;
        onHandoff();
      } else {
        setBlocked(true); // popup blocker: the visible button below is a real user click
      }
      setStatus('ready');
    }, reduced ? 400 : 1900);
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="glass mx-auto w-full max-w-xl space-y-5 rounded-[2rem] p-6 text-left sm:p-9">
        <div>
          <label htmlFor="f-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-rosetext">
            {content.wish.nameLabel}
          </label>
          <input
            id="f-name"
            className="field"
            value={name}
            maxLength={MAX.name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'e-name' : undefined}
            required
          />
          {errors.name && (
            <p id="e-name" role="alert" className="mt-1 text-xs text-[#a3335a]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="f-answer" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-rosetext">
            {content.wish.answerLabel}
          </label>
          <input id="f-answer" className="field" value={`${content.wish.answerValue} ♡`} readOnly />
        </div>

        <div>
          <label htmlFor="f-wish" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-rosetext">
            {content.wish.wishLabel}
          </label>
          <textarea
            id="f-wish"
            className="field min-h-[7.5rem] resize-y"
            placeholder={content.wish.wishPlaceholder}
            value={wish}
            maxLength={MAX.wish}
            onChange={(e) => setWish(e.target.value)}
            aria-invalid={!!errors.wish}
            aria-describedby={errors.wish ? 'e-wish' : undefined}
            required
          />
          <div className="mt-1 flex justify-between text-xs">
            <span id="e-wish" role={errors.wish ? 'alert' : undefined} className="text-[#a3335a]">
              {errors.wish}
            </span>
            <span className="text-rosetext">
              {wish.length}/{MAX.wish}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="f-msg" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-rosetext">
            {content.wish.messageLabel}
          </label>
          <textarea
            id="f-msg"
            className="field min-h-[6rem] resize-y"
            placeholder={content.wish.messagePlaceholder}
            value={message}
            maxLength={MAX.message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {errors.form && (
          <p role="alert" className="text-sm text-[#a3335a]">
            {errors.form}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={status !== 'idle'}>
          <Send size={16} aria-hidden="true" />
          {content.wish.submit}
        </button>
      </form>

      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            key="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Sending your wish"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-blush/80 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] p-8 text-center">
              <SendingEnvelope reduced={reduced} />
              {status === 'sending' ? (
                <>
                  <div className="ring" role="progressbar" aria-label="Loading" />
                  <p className="font-cormorant text-2xl italic text-inkdeep" aria-live="polite">
                    {content.wish.sending}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-playfair text-2xl text-inkdeep">{content.wish.readyTitle}</h2>
                  <p className="text-sm leading-relaxed text-ink">
                    {blocked ? content.wish.blockedBody : content.wish.readyBody}
                  </p>
                  <div className="flex w-full flex-col gap-3">
                    <a
                      href={urlRef.current}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        onHandoff();
                        setBlocked(false);
                      }}
                      className="btn btn-primary"
                    >
                      {blocked ? content.wish.openWa : content.wish.openWaAgain}
                    </a>
                    <button type="button" className="btn btn-ghost" onClick={onContinue}>
                      {content.wish.done} ♡
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
