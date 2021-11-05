import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {AreaChart, Area, Tooltip} from 'recharts';
import {Button, Flex, Heading, HStack, Text, useToast} from '@chakra-ui/react';
import {getPriceData} from './api';

import './App.css';

interface PriceData {
  timestamp: number,
  price: number
}


function App() {
  const toast = useToast();

  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<PriceData[]>([]);
  const [activePrice, setActivePrice] = useState<PriceData>();

  useEffect(() => {
    getPriceData(days)
      .then(data => {
        const priceData = data.map(priceData => ({timestamp: priceData[0], price: priceData[1]}));
        setData(priceData);
        setActivePrice(priceData[priceData.length - 1]);
      })
      .catch(err => {
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, [days, toast]);

  if (data.length === 0) return null;

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" width="600px" p={10} my={0} mx="auto">
      <Heading as="h1" mb={5}>Recharts DEMO</Heading>
      <Heading as="h3" alignSelf="flex-start">${activePrice?.price.toFixed(2)}</Heading>
      <Text alignSelf="flex-start">{moment(activePrice?.timestamp).format('DD MMMM, YYYY')}</Text>
      <AreaChart
        width={600}
        height={200}
        data={data}
        onMouseLeave={() => setActivePrice(data[data.length - 1])}
      >
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF1A1A" stopOpacity={1} />
            <stop offset="100%" stopColor="#FF1A1A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke="#FF1A1A"
          strokeWidth={3}
          fill="url(#linear)"
        />
        <Tooltip
          // @ts-ignore
          content={({ payload }) => {
            if (payload && payload.length > 0)
              setActivePrice(payload[0].payload);

            return null;
          }}
          cursor={{
            strokeDasharray: "7 7",
            strokeLinecap: "round",
            strokeWidth: "3px",
            strokeOpacity: 0.5,
            stroke: "#ffffff"
          }}
        />
      </AreaChart>
      <HStack spacing={4} alignSelf="flex-end">
        <Button onClick={() => setDays(7)}>1W</Button>
        <Button onClick={() => setDays(30)}>1M</Button>
        <Button onClick={() => setDays(90)}>3M</Button>
        <Button onClick={() => setDays(180)}>6M</Button>
        <Button onClick={() => setDays(360)}>1Y</Button>
      </HStack>
    </Flex>
  );
}

export default App;
