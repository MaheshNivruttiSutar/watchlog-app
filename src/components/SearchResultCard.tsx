import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { countRender, isProfileBaseline } from '../debug/renderCounts';
import { badgeClass, btnDanger, btnPrimary } from '../styles/ui';
import type { SearchResult } from '../types/watchlistItem';

const searchCardAction = 'mt-auto w-full shrink-0 whitespace-nowrap';

interface SearchResultCardProps {
  result: SearchResult;
  alreadyAdded: boolean;
  onAdd: (result: SearchResult) => void;
  onRemove: (id: string) => void;
}

/**
 * A single search tile. React.memo skips this tile when its props have not
 * changed, while useTranslation still re-renders it when the locale changes.
 */
function SearchResultCard({
  result,
  alreadyAdded,
  onAdd,
  onRemove,
}: SearchResultCardProps) {
  countRender('SearchResultCard');
  const { t } = useTranslation();
  const id = result.type + '-' + result.externalId;
  const subtitle =
    result.author ||
    (result.releaseYear
      ? String(result.releaseYear)
      : t(`media.${result.type}`));

  function handleClick() {
    if (alreadyAdded) {
      onRemove(id);
    } else {
      onAdd(result);
    }
  }

  return (
    <li className="flex flex-col overflow-hidden border border-border rounded-card bg-surface-raised shadow-card">
      <div className="relative aspect-2/3 bg-surface-overlay">
        {result.coverUrl ? (
          <img
            src={result.coverUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted">
            {t('common.noCover')}
          </div>
        )}
        <span className={badgeClass('right', result.type)}>
          {t(`media.${result.type}`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 gap-1">
        <p className="m-0 font-semibold text-foreground truncate">
          {result.title}
        </p>
        <p className="m-0 text-sm text-muted truncate">{subtitle}</p>

        <button
          type="button"
          onClick={handleClick}
          className={
            alreadyAdded
              ? `${btnDanger} ${searchCardAction}`
              : `${btnPrimary} ${searchCardAction}`
          }
        >
          {alreadyAdded ? t('common.remove') : t('search.addToWatchlist')}
        </button>
      </div>
    </li>
  );
}

const MemoSearchResultCard = memo(SearchResultCard);

export default function SearchResultCardExport(props: SearchResultCardProps) {
  if (isProfileBaseline()) {
    return <SearchResultCard {...props} />;
  }
  return <MemoSearchResultCard {...props} />;
}
