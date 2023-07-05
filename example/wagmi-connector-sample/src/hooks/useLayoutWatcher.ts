import { useMediaQuery } from '@mui/material';

export default function useResponsiveWatchers() {
  const mobileMatches = useMediaQuery('(min-width:425px)');

  const smMatches = useMediaQuery('(min-width:640px)');
  const mdMatches = useMediaQuery('(min-width:768px)');
  const lgMatches = useMediaQuery('(min-width:1024px)');
  const xlMatches = useMediaQuery('(min-width:1280px)');
  const xl2Matches = useMediaQuery('(min-width:1536px)');

  const px1128Matches = useMediaQuery('(min-width:1128px)');
  const px805Matches = useMediaQuery('(min-width:805px)');
  const px745Matches = useMediaQuery('(min-width:745px)');

  return {
    px1128Matches,
    px745Matches,
    px805Matches,
    mobileMatches,
    smMatches,
    mdMatches,
    lgMatches,
    xlMatches,
    xl2Matches,
  };
}
