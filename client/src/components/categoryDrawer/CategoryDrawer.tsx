import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../constants/categories';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryDrawer = ({ isOpen, onClose }: CategoryDrawerProps) => {
  const navigate = useNavigate();

  const handleNavigation = (cat: string) => {
    navigate(`/products?category=${cat}`);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: '320px' }, padding: '20px 20px' },
        },
      }}
    >
      <Box className="flex items-center justify-end">
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <List disablePadding>
        {useCategories().map((item) => {
          const isSub = item.cat.includes(',');

          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.cat)}
                sx={{
                  py: isSub ? 0.5 : 1.5,
                  pl: isSub ? 4 : 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                <ListItemText
                  primary={item.title}
                  slotProps={{
                    primary: {
                      sx: {
                        textTransform: 'uppercase',
                        fontSize: isSub ? '13px' : '16px',
                        fontWeight: isSub ? 300 : 400,
                        letterSpacing: '1px',
                        color: isSub ? '#666' : '#000',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default CategoryDrawer;
