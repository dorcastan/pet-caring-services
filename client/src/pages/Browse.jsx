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
  TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';
import { isUndefined } from 'lodash';
import { useHistory } from 'react-router-dom';
import SimpleRating from './Bookings/Components/SimpleRating';
import SelectPet from './Browse/SelectPet';
import api from '../api';
import { useStore } from '../utilities/store';
import SelectTransferType from './Browse/SelectTransferType';

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
      await api.bids.applyBids(body);
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

                console.log(caretakers);
              } catch (err) {
                console.log(err.message);
              }
              console.log(
                `rating:${rating}Pet:${pet.name}${pet.categoryname}${dailyPrice}start date: ${dateFrom}remarks${remarks}`,
              );
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
                <ListItemText
                  primary={
                    <Typography component="span" variant="h3" color="Primary">
                      {`${caretaker.username}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {`Total average rating: ${caretaker.totalaveragerating} `}
                      </Typography>
                    </>
                  }
                />

                <ListItemSecondaryAction>
                  <>
                    <Typography component="span" variant="h3" color="Primary" alignRight>
                      {`$${dailyPrice * (moment(dateTo).day() - moment(dateFrom).day() + 1)} `}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleApply(caretaker)}
                      color="primary"
                    >
                      {'BOOK ME'}
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
