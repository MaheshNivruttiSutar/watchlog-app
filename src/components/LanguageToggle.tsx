import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useTranslation } from 'react-i18next';
import { isLocale } from '../i18n/locale';
import { useUiStore } from '../store/uiStore';
import { chipToggleItem } from '../styles/ui';

function LanguageToggle() {
  const { t } = useTranslation();
  const locale = useUiStore((state) => state.locale);
  const setLocale = useUiStore((state) => state.setLocale);

  return (
    <ToggleGroup.Root
      type="single"
      value={locale}
      onValueChange={(next) => {
        if (isLocale(next)) setLocale(next);
      }}
      aria-label={t('language.switcher')}
      className="flex gap-1"
    >
      <ToggleGroup.Item value="en" className={`${chipToggleItem} px-2.5 py-1 text-xs`}>
        {t('language.en')}
      </ToggleGroup.Item>
      <ToggleGroup.Item value="hi" className={`${chipToggleItem} px-2.5 py-1 text-xs`}>
        {t('language.hi')}
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

export default LanguageToggle;
