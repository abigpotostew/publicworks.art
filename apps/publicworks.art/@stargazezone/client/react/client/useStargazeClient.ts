import { useContext } from 'react';
import StargazeContext from './StargazeContext';

export default function useStargazeClient() {
  const stargazeClient = useContext(StargazeContext);
  return stargazeClient;
}
