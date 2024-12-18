import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Grid,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Stack,
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { LeaveRequest } from '../../../types/leave';
import { Holiday } from '../../../types/holiday';

interface LeaveCalendarProps {
  leaves: LeaveRequest[];
  holidays: Holiday[];
  departments: string[];
  onDateClick?: (date: Date) => void;
}

interface DayProps {
  date: Date;
  isCurrentMonth: boolean;
  leaves: LeaveRequest[];
  holiday?: Holiday;
  onClick?: (date: Date) => void;
}

interface CalendarFilters {
  department?: string;
  employeeName?: string;
  leaveType?: string;
  status?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const Day: React.FC<DayProps> = ({ date, isCurrentMonth, leaves, holiday, onClick }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dayLeaves = leaves.filter(
    (leave) =>
      new Date(leave.startDate) <= date && new Date(leave.endDate) >= date
  );

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <>
      <Box
        sx={{
          p: 1,
          height: '100px',
          border: '1px solid #eee',
          backgroundColor: holiday
            ? '#fff3e0'
            : isWeekend
            ? '#f5f5f5'
            : 'white',
          opacity: isCurrentMonth ? 1 : 0.5,
          position: 'relative',
          cursor: dayLeaves.length > 0 || holiday ? 'pointer' : 'default',
          ...(isToday && {
            border: '2px solid #1976d2',
          }),
        }}
        onClick={() => (dayLeaves.length > 0 || holiday) && setDialogOpen(true)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isToday ? 'bold' : 'normal',
            }}
          >
            {date.getDate()}
          </Typography>
          {holiday && (
            <Tooltip title={holiday.name}>
              <Chip
                label="Férié"
                size="small"
                color="warning"
                sx={{ height: '20px' }}
              />
            </Tooltip>
          )}
        </Box>
        {dayLeaves.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {dayLeaves.slice(0, 2).map((leave) => (
              <Tooltip
                key={leave.id}
                title={`${leave.type} - ${leave.status}`}
              >
                <Chip
                  label={leave.employeeName}
                  size="small"
                  sx={{ mb: 0.5, maxWidth: '100%' }}
                  color={
                    leave.status.includes('VALIDE')
                      ? 'success'
                      : leave.status.includes('REFUSE')
                      ? 'error'
                      : 'warning'
                  }
                />
              </Tooltip>
            ))}
            {dayLeaves.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{dayLeaves.length - 2} autres
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {date.toLocaleDateString()}
          {holiday && (
            <Chip
              label={holiday.name}
              color="warning"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {dayLeaves.map((leave) => (
            <Box key={leave.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{leave.employeeName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {leave.type} - {leave.department}
              </Typography>
              <Typography variant="body2">
                Du {new Date(leave.startDate).toLocaleDateString()} au{' '}
                {new Date(leave.endDate).toLocaleDateString()}
              </Typography>
              <Chip
                label={leave.status}
                size="small"
                color={
                  leave.status.includes('VALIDE')
                    ? 'success'
                    : leave.status.includes('REFUSE')
                    ? 'error'
                    : 'warning'
                }
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const FilterDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  departments: string[];
}> = ({ open, onClose, filters, onFiltersChange, departments }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filtres du calendrier</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Direction</InputLabel>
            <Select
              value={localFilters.department || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, department: e.target.value })
              }
              label="Direction"
            >
              <MenuItem value="">Toutes</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nom de l'employé"
            value={localFilters.employeeName || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, employeeName: e.target.value })
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Type de congé</InputLabel>
            <Select
              value={localFilters.leaveType || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, leaveType: e.target.value })
              }
              label="Type de congé"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="CONGE_ANNUEL">Congé annuel</MenuItem>
              <MenuItem value="CONGE_MALADIE">Congé maladie</MenuItem>
              <MenuItem value="CONGE_DECES">Congé décès</MenuItem>
              <MenuItem value="EVENEMENT_FAMILIAL">Événement familial</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={localFilters.status || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, status: e.target.value })
              }
              label="Statut"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="VALIDE">Validé</MenuItem>
              <MenuItem value="EN_ATTENTE">En attente</MenuItem>
              <MenuItem value="REFUSE">Refusé</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleApply} variant="contained">
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaves,
  holidays,
  departments,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<Date[][]>([]);
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    const weeks: Date[][] = [];
    let week: Date[] = [];
    let day = 1;

    // Ajouter les jours du mois précédent
    for (let i = 0; i < startingDay; i++) {
      const prevMonthDay = new Date(year, month, -startingDay + i + 1);
      week.push(prevMonthDay);
    }

    // Ajouter les jours du mois en cours
    while (day <= monthLength) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      week.push(new Date(year, month, day));
      day++;
    }

    // Ajouter les jours du mois suivant
    while (week.length < 7) {
      week.push(
        new Date(year, month + 1, week.length - startingDay - monthLength + 1)
      );
    }
    weeks.push(week);

    setCalendar(weeks);
  };

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filters.department && leave.department !== filters.department) return false;
    if (
      filters.employeeName &&
      !leave.employeeName
        .toLowerCase()
        .includes(filters.employeeName.toLowerCase())
    )
      return false;
    if (filters.leaveType && leave.type !== filters.leaveType) return false;
    if (
      filters.status &&
      !leave.status.toLowerCase().includes(filters.status.toLowerCase())
    )
      return false;
    if (
      filters.dateRange?.start &&
      new Date(leave.endDate) < filters.dateRange.start
    )
      return false;
    if (
      filters.dateRange?.end &&
      new Date(leave.startDate) > filters.dateRange.end
    )
      return false;
    return true;
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth}>
          <PrevIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterIcon />
        </IconButton>
        <IconButton onClick={handleNextMonth}>
          <NextIcon />
        </IconButton>
      </Box>

      <Grid container spacing={0}>
        {DAYS_OF_WEEK.map((day) => (
          <Grid item xs key={day}>
            <Box
              sx={{
                p: 1,
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #eee',
              }}
            >
              <Typography variant="body2">{day}</Typography>
            </Box>
          </Grid>
        ))}

        {calendar.map((week, weekIndex) =>
          week.map((date, dayIndex) => (
            <Grid item xs key={`${weekIndex}-${dayIndex}`}>
              <Day
                date={date}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                leaves={filteredLeaves}
                holiday={holidays.find(
                  (h) => h.date.toDateString() === date.toDateString()
                )}
                onClick={onDateClick}
              />
            </Grid>
          ))
        )}
      </Grid>

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
      />
    </Paper>
  );
};

export default LeaveCalendar;
