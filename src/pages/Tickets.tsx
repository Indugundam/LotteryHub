
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket as TicketIcon, ExternalLink } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useLottery } from '@/context/LotteryContext';

const Tickets = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userTickets, lotteries } = useLottery();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Don't render anything while checking auth
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>;
      case 'won':
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Won</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLotteryName = (lotteryId: string) => {
    const lottery = lotteries.find(l => l.id === lotteryId);
    return lottery ? lottery.name : 'Unknown Lottery';
  };

  // Sort tickets by purchase date (newest first)
  const sortedTickets = [...userTickets].sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
          
          {sortedTickets.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>
                  View all your lottery ticket purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Lottery</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTickets.map(ticket => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <TicketIcon className="h-4 w-4 mr-2 text-primary" />
                            {ticket.ticketNumber}
                          </div>
                        </TableCell>
                        <TableCell>{getLotteryName(ticket.lotteryId)}</TableCell>
                        <TableCell>{new Date(ticket.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>${ticket.price.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/lottery/${ticket.lotteryId}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16 bg-muted rounded-lg">
              <TicketIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No tickets yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't purchased any lottery tickets yet.
              </p>
              <Button onClick={() => navigate('/lotteries')}>
                View Available Lotteries
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Tickets;
