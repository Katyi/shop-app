import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../constants/categories';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryDrawer = ({ isOpen, onClose }: CategoryDrawerProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (cat: string) => {
    navigate(`/products/${cat === 'all' ? 'all' : cat}`);
    onClose(); // Закрываем слайдер после клика
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      // Настройка ширины
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: '350px' }, padding: '20px' },
        },
      }}
    >
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="uppercase font-light">
          {t('categories.title', 'Categories')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ mt: 2 }}>
        {useCategories().map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.cat)}
              sx={{ py: 2 }}
            >
              <ListItemText
                primary={item.cat}
                slotProps={{
                  primary: {
                    sx: {
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 300,
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CategoryDrawer;
