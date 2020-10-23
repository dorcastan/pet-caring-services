import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import api from '../../api';
import { useStore } from '../../utilities/store';
var moment = require("moment");

const Upcoming = () => {
  const [allBids, setAllBids] = useState([]);
  const [rating, setRating] = React.useState(2);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const store = useStore();

  useEffect(() => {
    api.bids.getPetOwnerBids(store.user.username).then((x) => setAllBids(x));
  }, [store.user.username]);

  console.log(`all bids${allBids}`);

  const handleClick = async (bid) => {
    try {
      const body = {
        petName: bid.petname,
        petOwnerUsername: bid.petownerusername,
        caretakerUsername: bid.caretakerusername,
        submittedAt: moment(bid.submittedat).format("YYYY-MM-DD HH:mm:ss"),
        startDate: bid.start,
        endDate: bid.end,
        status: bid.status,
        transactionDateTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        paymentMethod: null,
        totalAmount: null,
        rating: null,
        comment: null,
        reviewDateTime: null,
      };
      console.log(body)
      console.log(`bids ${bid.submittedat}`)
      console.log(moment(bid.submittedat).subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss"));
      await api.bids.updateBids(body);
    } catch (err) {
      console.log(`err${err.message}`);
    }
  };

  return (
    <>
      <Paper style={{ margin: 30, padding: 30 }}>
        <Typography>{'Status: Accepted'}</Typography>
      </Paper>
      <List>
        {allBids
          .filter((bids) => bids.status === 'Accepted')
          .map((bids) => {
            return (
              <Paper style={{ margin: 30, padding: 30 }} key={bids.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography component="span" variant="body2" color="Primary">
                        {`${bids.transactiondatetime}`}
                      </Typography>
                    }
                    secondary={
                      <div>
                        <Typography component="span" variant="body1">
                          {`Caretaker: ${bids.caretakerusername}
                                                 Applied on: ${bids.submittedat}
                                                 Start date: ${bids.startdate} 
                                                 End date: ${bids.enddate}
                                                 Transfer type: ${bids.transfertype}
                                                 Remarks: ${bids.remarks}`}
                        </Typography>
                      </div>
                    }
                  />
                  <ListItemText />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      disabled = {bids.transactiondatetime}
                      onClick={() => {
                        handleClick(bids);
                      }}
                    >
                      {'Make Payment'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            );
          })}
      </List>
    </>
  );
};

export default Upcoming;
