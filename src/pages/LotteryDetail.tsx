import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  CalendarDays, 
  Check, 
  Clock, 
  DollarSign, 
  Info, 
  Loader2, 
  ShoppingCart, 
  Ticket, 
  Trophy 
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useLottery } from '@/context/LotteryContext';

const LotteryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { lotteries, userTickets, purchaseTicket, declareWinner, loading } = useLottery();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const lottery = lotteries.find(lottery => lottery.id === id);

  if (!lottery) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Lottery Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The lottery you're looking for doesn't exist or may have been removed.
        </p>
        <Button onClick={() => navigate('/lotteries')}>
          View All Lotteries
        </Button>
      </div>
    );
  }

  // Check if user has already purchased tickets for this lottery
  const userTicketsForLottery = userTickets.filter(
    ticket => ticket.lotteryId === lottery?.id
  );

  const hasTickets = userTicketsForLottery.length > 0;

  // Find winning ticket details if lottery is drawn
  const winningTicketDetails = lottery?.status === 'drawn' && lottery.winningTicket
    ? userTickets.find(
        ticket => 
          ticket.lotteryId === lottery.id && 
          ticket.ticketNumber === lottery.winningTicket
      )
    : null;

  const handlePurchase = async () => {
    if (!isAuthenticated || !lottery) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase a ticket",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsPurchasing(true);
    try {
      // Generate a random ticket number
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      const ticketNumber = `${Math.floor(randomNumber / 1000)}-${randomNumber % 1000}`;
      await purchaseTicket(lottery.id, ticketNumber);
      setDialogOpen(false);
      
      toast({
        title: "Ticket purchased!",
        description: `Your ticket number is ${ticketNumber}`,
      });
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      
      toast({
        title: "Purchase failed",
        description: "There was an error purchasing your ticket",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDeclareWinner = async () => {
    if (!lottery) return;
    
    setIsDeclaring(true);
    try {
      // Generate random winning ticket number
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      const winningNumber = `${Math.floor(randomNumber / 1000)}-${randomNumber % 1000}`;
      await declareWinner(lottery.id, winningNumber);
      
      toast({
        title: "Winner declared!",
        description: `The winning ticket is ${winningNumber}`,
      });
    } catch (error) {
      console.error('Error declaring winner:', error);
      
      toast({
        title: "Error",
        description: "Failed to declare winner",
        variant: "destructive",
      });
    } finally {
      setIsDeclaring(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isPast = lottery ? new Date(lottery.drawDate) < new Date() : false;
  const isActiveAndPast = lottery?.status === 'active' && isPast;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/lotteries')}
              className="mb-6"
            >
              Back to Lotteries
            </Button>
            
            {lottery.status === 'drawn' && (
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 ml-2">
                Completed
              </div>
            )}
            
            {isActiveAndPast && (
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600 ml-2">
                Draw Pending
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lottery Details */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-3xl">{lottery.name}</CardTitle>
                  <CardDescription className="text-base">{lottery.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Jackpot</div>
                        <div className="font-bold text-xl">${lottery.jackpot.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Ticket Price</div>
                        <div className="font-bold text-xl">${lottery.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Draw Date</div>
                        <div className="font-bold">
                          {new Date(lottery.drawDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <div className="text-sm text-muted-foreground">Draw Time</div>
                        <div className="font-bold">
                          {new Date(lottery.drawDate).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {lottery?.status === 'drawn' && lottery.winningTicket && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <div className="flex items-start">
                        <Trophy className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-green-700 mb-1">Winner Announced</h3>
                          <p className="text-green-600 text-sm">
                            Ticket #{lottery.winningTicket} was the winner of this lottery.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isActiveAndPast && isAdmin && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-yellow-700 mb-1">Admin Action Required</h3>
                          <p className="text-yellow-600 text-sm mb-3">
                            The draw date has passed. As an admin, you can declare a winner for this lottery.
                          </p>
                          <Button 
                            onClick={handleDeclareWinner} 
                            disabled={isDeclaring}
                            variant="outline" 
                            className="bg-white"
                          >
                            {isDeclaring ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Selecting Winner...
                              </>
                            ) : (
                              <>
                                <Trophy className="h-4 w-4 mr-2" />
                                Draw Winner
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Ticket Purchase */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                  <CardDescription>
                    {hasTickets 
                      ? `You have ${userTicketsForLottery.length} ticket(s) for this lottery`
                      : 'You haven\'t purchased any tickets yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasTickets ? (
                    <div className="space-y-3">
                      {userTicketsForLottery.map(ticket => (
                        <div 
                          key={ticket.id}
                          className={`flex items-center justify-between border p-3 rounded-md ${
                            ticket.status === 'won' 
                              ? 'bg-green-50 border-green-200' 
                              : ticket.status === 'lost'
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <Ticket className={`h-4 w-4 mr-2 ${
                              ticket.status === 'won' 
                                ? 'text-green-500' 
                                : ticket.status === 'lost'
                                ? 'text-gray-400'
                                : 'text-primary'
                            }`} />
                            <span className="font-medium">{ticket.ticketNumber}</span>
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'pending' 
                                ? 'bg-orange-100 text-orange-600' 
                                : ticket.status === 'won'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No tickets purchased for this lottery
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {lottery?.status === 'active' ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Ticket
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Purchase</DialogTitle>
                          <DialogDescription>
                            You are about to purchase a ticket for {lottery.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Price:</span>
                            <span>${lottery.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Draw Date:</span>
                            <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
                          </div>
                          <Separator className="my-4" />
                          <p className="text-sm text-muted-foreground">
                            By purchasing this ticket, you agree to our terms and conditions.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handlePurchase} disabled={isPurchasing}>
                            {isPurchasing ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Confirm Purchase
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button disabled className="w-full">
                      Lottery Closed
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {winningTicketDetails && winningTicketDetails.userId === user?.id && (
                <Card className="mt-6 bg-green-50 border-green-200 animate-pulse-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-700 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-green-500" />
                      Congratulations!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      Your ticket #{lottery.winningTicket} won this lottery! 
                      Contact support to claim your prize.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LotteryDetail;
