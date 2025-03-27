
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Ticket, 
  Trophy, 
  User,
  ArrowRight,
  CircleDollarSign,
  Clock
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useLottery } from '@/context/LotteryContext';

const Dashboard = () => {
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

  // Calculate ticket statistics
  const pendingTickets = userTickets.filter(t => t.status === 'pending');
  const wonTickets = userTickets.filter(t => t.status === 'won');
  const lostTickets = userTickets.filter(t => t.status === 'lost');
  
  // Get upcoming draws
  const upcomingDraws = lotteries
    .filter(lottery => lottery.status === 'active')
    .sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime())
    .slice(0, 3);

  // Get user's most recent tickets
  const recentTickets = [...userTickets]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user.username}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Tickets</CardDescription>
              <CardTitle className="text-3xl font-bold">{userTickets.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-4 w-4 mr-1" />
                <span className="text-sm">All time purchases</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Draws</CardDescription>
              <CardTitle className="text-3xl font-bold">{pendingTickets.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Awaiting results</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Winning Tickets</CardDescription>
              <CardTitle className="text-3xl font-bold">{wonTickets.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-green-600">
                <Trophy className="h-4 w-4 mr-1" />
                <span className="text-sm">Congratulations!</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Money Spent</CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${userTickets.reduce((sum, ticket) => sum + ticket.price, 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <CircleDollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">Total investments</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tickets">
              <TabsList className="mb-6">
                <TabsTrigger value="tickets">
                  <Ticket className="h-4 w-4 mr-2" />
                  My Tickets
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Upcoming Draws
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tickets" className="animate-fade-in">
                <div className="bg-card rounded-lg border p-4 mb-4">
                  <h3 className="font-medium mb-4">Recent Ticket Purchases</h3>
                  {recentTickets.length > 0 ? (
                    <div className="space-y-3">
                      {recentTickets.map(ticket => {
                        const lottery = lotteries.find(l => l.id === ticket.lotteryId);
                        return (
                          <div key={ticket.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div>
                              <div className="font-medium">{lottery?.name || 'Unknown Lottery'}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Ticket className="h-3 w-3 mr-1" />
                                {ticket.ticketNumber}
                              </div>
                            </div>
                            <div className="text-right">
                              <div>${ticket.price.toFixed(2)}</div>
                              <div className="text-sm">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    ticket.status === 'pending'
                                      ? 'bg-orange-100 text-orange-700'
                                      : ticket.status === 'won'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Ticket className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">You haven't purchased any tickets yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/lotteries')}
                      >
                        Browse Lotteries
                      </Button>
                    </div>
                  )}
                </div>
                
                {userTickets.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" onClick={() => navigate('/tickets')}>
                      View All Tickets
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="animate-fade-in">
                <div className="bg-card rounded-lg border p-4 mb-4">
                  <h3 className="font-medium mb-4">Upcoming Lottery Draws</h3>
                  {upcomingDraws.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDraws.map(lottery => (
                        <div key={lottery.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <div className="font-medium">{lottery.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(lottery.drawDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${lottery.jackpot.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Jackpot</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">No upcoming lottery draws</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <Button variant="outline" onClick={() => navigate('/lotteries')}>
                    View All Lotteries
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* User Profile */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border-b">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-3">
                      <span className="text-2xl font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{user.username}</h3>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    <h4 className="text-sm font-medium mb-2">Account Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since</span>
                        <span>2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tickets Purchased</span>
                        <span>{userTickets.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tickets Won</span>
                        <span>{wonTickets.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span>
                          {userTickets.length > 0
                            ? `${Math.round((wonTickets.length / userTickets.length) * 100)}%`
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
