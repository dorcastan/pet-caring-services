import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  TextField,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import React, { useEffect, useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import SimpleRating from './Bookings/Components/SimpleRating';
import SelectPet from './Browse/SelectPet';
import api from '../api';
import { useStore } from '../utilities/store';
import SelectTransferType from './Browse/SelectTransferType';
import { useSnackbarContext } from '../utilities/snackbar';

const moment = require('moment');

const Browse = () => {
  const [rating, setRating] = React.useState(2);

  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());

  const [petOptions, setPetOptions] = useState([]);
  const [pet, setPet] = useState();

  const [transferTypeOptions, setTransferTypeOptions] = useState([]);
  const [transferType, setTransferType] = useState();

  const [remarks, setRemarks] = useState();
  const [caretakers, setCaretakers] = useState([]);
  const [dailyPrice, setDailyPrice] = useState();
  const store = useStore();

  const history = useHistory();
  const showSnackbar = useSnackbarContext();


  useEffect(() => {
    api.pets.getPetPet(store.user.username).then((x) => setPetOptions(x));
    api.transferType.getTransferTypes().then((x) => setTransferTypeOptions(x));
  }, [store.user.username]);

  const handleApply = async (caretaker) => {
    try {
      const body = {
        petName: pet.name,
        petOwnerUsername: store.user.username,
        caretakerUsername: caretaker.username,
        dailyPrice,
        submittedAt: moment.utc(moment(), 'YYYY-MM-DD HH:mm:ss.SSS'),
        startDate: dateFrom,
        endDate: dateTo,
        transferType,
        remarks,
      };
      await showSnackbar(api.bids.applyBids(body));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Card style={{ margin: 30, padding: 30 }}>
        <CardContent>
          <Typography>{'I am looking to book a caretaker for: '}</Typography>
          <SelectPet petOptions={petOptions} pet={pet} setPet={setPet} />
          <SelectTransferType
            transferTypeOptions={transferTypeOptions}
            setTransferType={setTransferType}
          />
          <Typography>{'From:'}</Typography>
          <KeyboardDatePicker
            value={dateFrom}
            onChange={(date) => setDateFrom(date)}
            minDate={new Date()}
            format="yyyy/MM/dd"
          />
          <Typography>{'To:'}</Typography>
          <KeyboardDatePicker
            value={dateTo}
            onChange={(date) => setDateTo(date)}
            minDate={dateFrom}
            minDateMessage="Date should not be earlier than start Date"
            format="yyyy/MM/dd"
          />
          <Typography>{''}</Typography>
          <TextField
            id="standard-basic"
            label="Remarks"
            onChange={(event) => {
              setRemarks(event.target.value);
            }}
          />

          <Typography>{'Minimum rating: '}</Typography>
          <SimpleRating rating={rating} setRating={setRating} />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => {
              try {
                const body = {
                  minRating: rating,
                  petCategory: pet.categoryname,
                  startDate: moment(dateFrom).format('YYYY-MM-DD'),
                  endDate: moment(dateTo).format('YYYY-MM-DD'),
                  offset: 0,
                };
                api.caretakers.getCaretakers(body).then((x) => {
                  setCaretakers(x.entries);
                  console.log(`total count ${x.entries}`);
                });

                api.petCategories
                  .getDailyPrice(pet.categoryname)
                  .then((x) => setDailyPrice(x[0].dailyprice));

              } catch (err) {
                console.log(err.message);
              }
             
            }}
          >
            {'SEARCH'}
          </Button>
        </CardActions>
      </Card>
      <List>
        {caretakers.map((caretaker) => {
          return (
            <Paper style={{ margin: 30, padding: 30 }} key={caretaker.caretakerusername}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => history.push(`/profile/${caretaker.username}`)}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography component="span" variant="h3" color="Primary">
                      {`${caretaker.name}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {`Username: ${caretaker.username} `}
                      </Typography>
                      {/* {`Total average rating: ${caretaker.totalaveragerating} `}
                      {`Bio: ${caretaker.bio} `} */}
                    </>
                  }
                />

                <ListItemSecondaryAction>
                  <>
                    <Typography component="span" variant="h4" color="Primary" alignRight>
                      {`$${dailyPrice * (moment(dateTo).diff(moment(dateFrom), 'days') + 1)} `}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleApply(caretaker)}
                      color="primary"
                    >
                      {'Send request'}
                    </Button>
                  </>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </>
  );
};

export default Browse;