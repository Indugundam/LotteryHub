import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Lottery {
  id: string;
  name: string;
  drawDate: string;
  prizeAmount: number;
  ticketPrice: number;
  image: string;
  description: string;
  status: 'active' | 'drawn' | 'upcoming';
  winningNumber?: string;
  winningTicket?: string;
  jackpot?: number;
  price?: number;
}

export interface Ticket {
  id: string;
  userId: string;
  lotteryId: string;
  ticketNumber: string;
  price: number;
  purchaseDate: string;
  status: 'pending' | 'won' | 'lost';
}

export interface Result {
  id: string;
  lotteryId: string;
  drawDate: string;
  winningNumber: string;
  prizeAmount: number;
}

interface LotteryContextType {
  lotteries: Lottery[];
  tickets: Ticket[];
  results: Result[];
  buyTicket: (lotteryId: string, ticketNumber: string) => void;
  getUserTickets: (userId: string) => Ticket[];
  getLotteryById: (id: string) => Lottery | undefined;
  getResultsByUserId: (userId: string) => Result[];
  userTickets: Ticket[];
  purchaseTicket: (lotteryId: string, ticketNumber: string) => void;
  declareWinner: (lotteryId: string, winningNumber: string) => void;
  loading: boolean;
}

// Mock data with real images from Unsplash
const MOCK_LOTTERIES: Lottery[] = [
  {
    id: '1',
    name: 'Mega Millions',
    drawDate: '2023-12-31',
    prizeAmount: 1000000,
    ticketPrice: 5,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    description: 'The biggest lottery of the year with a guaranteed million-dollar prize!',
    status: 'active',
    jackpot: 1000000,
    price: 5,
  },
  {
    id: '2',
    name: 'Weekly Cash Draw',
    drawDate: '2023-11-15',
    prizeAmount: 50000,
    ticketPrice: 2,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    description: 'Try your luck in our weekly draw for a chance to win $50,000 in cash!',
    status: 'upcoming',
    jackpot: 50000,
    price: 2,
  },
  {
    id: '3',
    name: 'Holiday Special',
    drawDate: '2023-12-25',
    prizeAmount: 250000,
    ticketPrice: 10,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    description: 'Special holiday lottery with multiple prize tiers and bonus rewards!',
    status: 'active',
    jackpot: 250000,
    price: 10,
  },
  {
    id: '4',
    name: 'Spring Jackpot',
    drawDate: '2023-03-20',
    prizeAmount: 75000,
    ticketPrice: 3,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    description: 'Celebrate the arrival of spring with our seasonal jackpot lottery!',
    status: 'drawn',
    winningNumber: '42-15-67-23-11',
    winningTicket: '42-15-67-23-11',
    jackpot: 75000,
    price: 3,
  },
  {
    id: '5',
    name: 'Community Fundraiser',
    drawDate: '2023-11-30',
    prizeAmount: 30000,
    ticketPrice: 1,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    description: '30% of ticket sales go to local community projects and charities!',
    status: 'active',
    jackpot: 30000,
    price: 1,
  },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    userId: '2',
    lotteryId: '1',
    ticketNumber: '12-34-56-78-90',
    price: 5,
    purchaseDate: '2023-10-15',
    status: 'pending',
  },
  {
    id: '2',
    userId: '2',
    lotteryId: '3',
    ticketNumber: '11-22-33-44-55',
    price: 10,
    purchaseDate: '2023-10-17',
    status: 'pending',
  },
  {
    id: '3',
    userId: '2',
    lotteryId: '4',
    ticketNumber: '42-15-67-23-10',
    price: 3,
    purchaseDate: '2023-03-15',
    status: 'lost',
  },
  {
    id: '4',
    userId: '3',
    lotteryId: '1',
    ticketNumber: '55-66-77-88-99',
    price: 5,
    purchaseDate: '2023-10-16',
    status: 'pending',
  },
];

const MOCK_RESULTS: Result[] = [
  {
    id: '1',
    lotteryId: '4',
    drawDate: '2023-03-20',
    winningNumber: '42-15-67-23-11',
    prizeAmount: 75000,
  },
];

const LotteryContext = createContext<LotteryContextType>({
  lotteries: [],
  tickets: [],
  results: [],
  buyTicket: () => {},
  getUserTickets: () => [],
  getLotteryById: () => undefined,
  getResultsByUserId: () => [],
  userTickets: [],
  purchaseTicket: () => {},
  declareWinner: () => {},
  loading: false,
});

export const LotteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>(MOCK_LOTTERIES);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [results, setResults] = useState<Result[]>(MOCK_RESULTS);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Calculate user tickets based on the current user
  const userTickets = tickets.filter(ticket => user && ticket.userId === user.id);

  const buyTicket = (lotteryId: string, ticketNumber: string) => {
    purchaseTicket(lotteryId, ticketNumber);
  };

  const purchaseTicket = (lotteryId: string, ticketNumber: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const lottery = lotteries.find((lottery) => lottery.id === lotteryId);
      if (!lottery) return;

      const newTicket: Ticket = {
        id: Math.random().toString(36).substring(2),
        userId: user.id,
        lotteryId,
        ticketNumber,
        price: lottery.ticketPrice,
        purchaseDate: new Date().toISOString().slice(0, 10),
        status: 'pending',
      };

      setTickets([...tickets, newTicket]);
    } finally {
      setLoading(false);
    }
  };

  const declareWinner = (lotteryId: string, winningNumber: string = generateRandomTicket()) => {
    setLoading(true);
    
    try {
      // Update lottery status
      setLotteries(prev => 
        prev.map(lottery => 
          lottery.id === lotteryId 
            ? {
                ...lottery,
                status: 'drawn', 
                winningNumber,
                winningTicket: winningNumber
              } 
            : lottery
        )
      );
      
      // Update ticket statuses
      setTickets(prev => 
        prev.map(ticket => {
          if (ticket.lotteryId === lotteryId) {
            const status = ticket.ticketNumber === winningNumber ? 'won' : 'lost';
            return {...ticket, status};
          }
          return ticket;
        })
      );
      
      // Add result
      const lottery = lotteries.find(l => l.id === lotteryId);
      if (lottery) {
        const newResult: Result = {
          id: Math.random().toString(36).substring(2),
          lotteryId,
          drawDate: new Date().toISOString().slice(0, 10),
          winningNumber,
          prizeAmount: lottery.prizeAmount,
        };
        
        setResults([...results, newResult]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate random ticket number
  const generateRandomTicket = () => {
    const numbers = [];
    for (let i = 0; i < 5; i++) {
      numbers.push(Math.floor(Math.random() * 90) + 10);
    }
    return numbers.join('-');
  };

  const getUserTickets = (userId: string) => {
    return tickets.filter((ticket) => ticket.userId === userId);
  };

  const getLotteryById = (id: string) => {
    return lotteries.find((lottery) => lottery.id === id);
  };

  const getResultsByUserId = (userId: string) => {
    const userTickets = getUserTickets(userId);
    const lotteryIds = userTickets.map((ticket) => ticket.lotteryId);
    return results.filter((result) => lotteryIds.includes(result.lotteryId));
  };

  return (
    <LotteryContext.Provider
      value={{
        lotteries,
        tickets,
        results,
        buyTicket,
        getUserTickets,
        getLotteryById,
        getResultsByUserId,
        userTickets,
        purchaseTicket,
        declareWinner,
        loading,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => useContext(LotteryContext);
