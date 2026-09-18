import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import RatingInput from '../components/RatingInput';
import {
  useRemoveWatchlistItem,
  useUpdateWatchlistRating,
  useUpdateWatchlistStatus,
  useWatchlistQuery,
} from '../hooks/useWatchlist';
import type { ItemType, WatchlistStatus } from '../types/watchlistItem';
import {
  btnDanger,
  cardStatusVariant,
  chipToggleItem,
  textLink,
  textMuted,
} from '../styles/ui';

type DetailStatusKey =
  | 'status.wantToWatch'
  | 'status.wantToRead'
  | 'status.watching'
  | 'status.reading'
  | 'status.done';

function statusLabelKey(
  status: WatchlistStatus,
  type: ItemType,
): DetailStatusKey {
  if (status === 'want') {
    return type === 'movie' ? 'status.wantToWatch' : 'status.wantToRead';
  }
  if (status === 'watching') return 'status.watching';
  if (status === 'reading') return 'status.reading';
  return 'status.done';
}

function formatAddedDate(dateAdded: string, locale: string): string {
  const parsed = new Date(`${dateAdded}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateAdded;

  return parsed.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Shared layout only — never mix with conflicting bg/text utilities. */
const detailTagLayout =
  'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide';

const detailFact =
  'px-4 py-3.5 border border-border rounded-card bg-surface-raised/88';

const detailFactLabel =
  'm-0 text-muted text-xs font-semibold uppercase tracking-wider';

const detailFactValue = 'm-0 mt-1.5 text-base font-semibold text-foreground';

function DetailPage() {
  const { t, i18n } = useTranslation();
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : undefined;
  const navigate = useNavigate();
  const watchlist = useWatchlistQuery();
  const removeItem = useRemoveWatchlistItem();
  const updateStatus = useUpdateWatchlistStatus();
  const setRating = useUpdateWatchlistRating();
  const [simulateRatingFailure, setSimulateRatingFailure] = useState(false);
  const items = watchlist.data ?? [];

  const item = items.find((entry) => entry.id === id);

  if (watchlist.isPending) {
    return (
      <div className="p-page">
        <p className={textMuted}>{t('detail.loading')}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-page">
        <p className={textMuted}>{t('detail.notFound')}</p>
        <Link to="/watchlist" className={textLink}>
          {t('detail.backToList')}
        </Link>
      </div>
    );
  }

  const year = item.type === 'movie' ? item.releaseYear : item.publishYear;
  const creator = item.type === 'movie' ? item.director : item.author;
  const creatorLabel =
    item.type === 'movie' ? t('detail.director') : t('detail.author');
  const yearLabel =
    item.type === 'movie' ? t('detail.releaseYear') : t('detail.publishYear');
  const statusText = t(statusLabelKey(item.status, item.type));
  const statusStyle = cardStatusVariant(item.status);

  const typeTagClass =
    item.type === 'movie'
      ? `${detailTagLayout} bg-movie text-white`
      : `${detailTagLayout} bg-book text-white`;

  return (
    <div className="relative overflow-hidden p-page">
      {item.coverUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <img
            src={item.coverUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-top blur-[48px] saturate-110 opacity-[0.22] scale-[1.08]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-surface from-0% via-transparent via-35% to-surface to-100%" />
        </div>
      )}

      <div className="relative z-1">
        <Link to="/watchlist" className={textLink}>
          ← {t('detail.backToList')}
        </Link>

        <article className="grid grid-cols-[14rem_minmax(0,1fr)] max-[700px]:grid-cols-1 gap-8 max-[700px]:gap-5 items-start mt-6 max-w-3xl">
          <div className="sticky top-6 max-[700px]:static max-[700px]:max-w-48">
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-full aspect-2/3 object-cover rounded-card border border-border bg-surface-overlay shadow-poster"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center justify-center w-full aspect-2/3 rounded-card border border-border bg-surface-overlay shadow-poster text-muted text-sm">
                {t('common.noCover')}
              </div>
            )}
          </div>

          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={typeTagClass}>{t(`media.${item.type}`)}</span>
              <span
                className={`${detailTagLayout} normal-case tracking-normal ${statusStyle.badge}`}
              >
                {statusText}
              </span>
            </div>

            <h1 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-foreground">
              {item.title}
            </h1>

            {(creator || year != null) && (
              <p className="m-0 mt-2 text-[1.05rem] text-muted">
                {creator
                  ? t(
                      item.type === 'movie'
                        ? 'detail.directedBy'
                        : 'detail.writtenBy',
                      { creator },
                    )
                  : null}
                {creator && year != null ? ' · ' : null}
                {year != null ? year : null}
              </p>
            )}

            {item.genres.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-5">
                {item.genres.map((genre) => (
                  <li
                    key={genre}
                    className="px-3 py-1.5 rounded-button bg-accent-soft text-accent text-sm font-medium"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            )}

            <section
              className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-3 mt-6"
              aria-label={t('detail.factsLabel')}
            >
              <div className={detailFact}>
                <p className={detailFactLabel} id={`status-label-${item.id}`}>
                  {t('detail.status')}
                </p>
                <ToggleGroup.Root
                  type="single"
                  value={item.status}
                  onValueChange={(next) => {
                    if (
                      next === 'want' ||
                      next === 'watching' ||
                      next === 'reading' ||
                      next === 'done'
                    ) {
                      updateStatus.mutate({ id: item.id, status: next });
                    }
                  }}
                  aria-labelledby={`status-label-${item.id}`}
                  className="mt-1 flex flex-wrap gap-2"
                >
                  <ToggleGroup.Item value="want" className={chipToggleItem}>
                    {t('status.want')}
                  </ToggleGroup.Item>
                  {item.type === 'movie' && (
                    <ToggleGroup.Item value="watching" className={chipToggleItem}>
                      {t('status.watching')}
                    </ToggleGroup.Item>
                  )}
                  {item.type === 'book' && (
                    <ToggleGroup.Item value="reading" className={chipToggleItem}>
                      {t('status.reading')}
                    </ToggleGroup.Item>
                  )}
                  <ToggleGroup.Item value="done" className={chipToggleItem}>
                    {t('status.done')}
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>

              <div className={detailFact}>
                <p className={detailFactLabel} id={`rating-label-${item.id}`}>
                  {t('detail.rating')}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <RatingInput
                    value={item.rating}
                    onChange={(rating) =>
                      setRating.mutate({
                        id: item.id,
                        rating,
                        simulateFailure: simulateRatingFailure,
                      })
                    }
                    aria-labelledby={`rating-label-${item.id}`}
                  />
                  <span className="text-muted text-sm font-medium">
                    {item.rating !== null
                      ? t('detail.ratingValue', { rating: item.rating })
                      : t('detail.notRated')}
                  </span>
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={simulateRatingFailure}
                    onChange={(event) =>
                      setSimulateRatingFailure(event.target.checked)
                    }
                  />
                  {t('detail.simulateFailure')}
                </label>
                {setRating.isError ? (
                  <p className="m-0 mt-2 text-sm text-danger" role="alert">
                    {t('detail.ratingReverted')}
                  </p>
                ) : null}
              </div>

              {year != null && (
                <div className={detailFact}>
                  <p className={detailFactLabel}>{yearLabel}</p>
                  <p className={detailFactValue}>{year}</p>
                </div>
              )}

              {creator && (
                <div className={detailFact}>
                  <p className={detailFactLabel}>{creatorLabel}</p>
                  <p className={detailFactValue}>{creator}</p>
                </div>
              )}

              <div className={`${detailFact} col-span-full`}>
                <p className={detailFactLabel}>{t('detail.dateAdded')}</p>
                <p className={detailFactValue}>
                  {formatAddedDate(
                    item.dateAdded,
                    i18n.resolvedLanguage ?? i18n.language,
                  )}
                </p>
              </div>
            </section>

            <div className="mt-7">
              <ConfirmDeleteDialog
                title={t('detail.removeTitle')}
                description={t('detail.removeDescription', {
                  title: item.title,
                })}
                confirmLabel={t('common.remove')}
                onConfirm={() => {
                  removeItem.mutate(item.id);
                  navigate('/watchlist');
                }}
                trigger={
                  <button type="button" className={btnDanger}>
                    {t('detail.removeFromWatchlist')}
                  </button>
                }
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default DetailPage;
