import { useState } from 'react';
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const SearchDrawer = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
}: SearchDrawerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Examples of popular queries
  const trendingSearches = [
    'Jeans',
    'Jacket',
    'Barrel Leg Trousers',
    'Merino',
    'Cashmere',
    'Dress',
  ];

  const handleSearchSubmit = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const finalTerm = typeof e === 'string' ? e : searchTerm;

    if (finalTerm.trim()) {
      // Update the history: remove the duplicate, add a new one to the beginning, leave the top 5
      const newHistory = [
        finalTerm.trim(),
        ...history.filter((item) => item !== finalTerm.trim()),
      ].slice(0, 5);

      setHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      navigate(`/products?search=${encodeURIComponent(finalTerm.trim())}`);
      onClose();
      setSearchTerm('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: '450px' },
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Close icon */}
      <Box className="flex justify-end">
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Search form */}
      <Box className="mt-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center border-b border-black py-2"
        >
          <input
            autoFocus
            type="text"
            placeholder={t('searchDrawer.search_placeholder')}
            className="w-full outline-none text-lg font-light"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton type="submit">
            <Search />
          </IconButton>
        </form>
      </Box>

      {/* Popular queries box */}
      <Box className="mt-10">
        <Typography
          variant="caption"
          className="text-gray-400 uppercase tracking-widest font-bold"
        >
          {t('searchDrawer.trending_searches')}
        </Typography>

        <List className="mt-2">
          {trendingSearches.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                onClick={() => handleSearchSubmit(item)}
                className="px-0 py-1"
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                <ListItemText
                  primary={`'${item}'`}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 300,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* history of search */}
      {history.length > 0 && (
        <Box className="mt-8">
          <Box className="flex justify-between items-center">
            <Typography
              variant="caption"
              className="text-gray-400 uppercase tracking-widest font-bold"
            >
              {t('searchDrawer.previous_searches')}
            </Typography>
            <button
              onClick={clearHistory}
              className="text-[10px] text-gray-400 underline uppercase hover:text-black"
            >
              {t('searchDrawer.clear')}
            </button>
          </Box>
          <List className="mt-2">
            {history.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleSearchSubmit(item)}
                  className="px-0 py-1"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <ListItemText
                    primary={`'${item}'`}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 300,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Drawer>
  );
};

export default SearchDrawer;
