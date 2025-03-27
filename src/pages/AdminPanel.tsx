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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users,
  Ticket as TicketIcon,
  Trophy,
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useLottery, Lottery, Ticket } from '@/context/LotteryContext';

const MOCK_USERS = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2023-01-15T12:00:00Z' },
  { id: '2', username: 'user', email: 'user@example.com', role: 'user', createdAt: '2023-02-20T14:30:00Z' },
  { id: '3', username: 'johndoe', email: 'john@example.com', role: 'user', createdAt: '2023-03-05T09:15:00Z' },
  { id: '4', username: 'janedoe', email: 'jane@example.com', role: 'user', createdAt: '2023-03-10T11:45:00Z' },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { lotteries, declareWinner, loading } = useLottery();
  const { toast } = useToast();
  const [processingLotteryId, setProcessingLotteryId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast({
        variant: 'destructive',
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
      });
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleDeclareWinner = async (lotteryId: string) => {
    setProcessingLotteryId(lotteryId);
    try {
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      const winningNumber = `${Math.floor(randomNumber / 1000)}-${randomNumber % 1000}`;
      await declareWinner(lotteryId, winningNumber);
    } catch (error) {
      console.error('Error declaring winner:', error);
    } finally {
      setProcessingLotteryId(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything if not admin
  }

  const pendingDrawLotteries = lotteries.filter(
    lottery => lottery.status === 'active' && new Date(lottery.drawDate) <= new Date()
  );

  const upcomingLotteries = lotteries.filter(
    lottery => lottery.status === 'active' && new Date(lottery.drawDate) > new Date()
  );

  const completedLotteries = lotteries.filter(lottery => lottery.status === 'drawn');

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Admin Access
            </Badge>
          </div>
          
          <Tabs defaultValue="lotteries" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="lotteries">
                <Trophy className="h-4 w-4 mr-2" />
                Lotteries
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <TicketIcon className="h-4 w-4 mr-2" />
                Tickets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lotteries" className="space-y-6">
              {pendingDrawLotteries.length > 0 && (
                <Card className="border-orange-200">
                  <CardHeader className="bg-orange-50 text-orange-700">
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Lotteries Requiring Action
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      These lotteries have passed their draw date and need a winner to be declared
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Draw Date</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Jackpot</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDrawLotteries.map(lottery => (
                          <TableRow key={lottery.id}>
                            <TableCell className="font-medium">{lottery.name}</TableCell>
                            <TableCell>{new Date(lottery.drawDate).toLocaleDateString()}</TableCell>
                            <TableCell>${lottery.price.toFixed(2)}</TableCell>
                            <TableCell>${lottery.jackpot.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                                Draw Pending
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={() => handleDeclareWinner(lottery.id)}
                                disabled={processingLotteryId === lottery.id || loading}
                              >
                                {processingLotteryId === lottery.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Draw Winner
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Lotteries</CardTitle>
                  <CardDescription>
                    Upcoming lottery draws
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Draw Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Jackpot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingLotteries.length > 0 ? (
                        upcomingLotteries.map(lottery => (
                          <TableRow key={lottery.id}>
                            <TableCell className="font-medium">{lottery.name}</TableCell>
                            <TableCell>{new Date(lottery.drawDate).toLocaleDateString()}</TableCell>
                            <TableCell>${lottery.price.toFixed(2)}</TableCell>
                            <TableCell>${lottery.jackpot.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/lottery/${lottery.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No active lotteries found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Completed Lotteries</CardTitle>
                  <CardDescription>
                    Past lottery draws and their winners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Draw Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Jackpot</TableHead>
                        <TableHead>Winning Ticket</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedLotteries.length > 0 ? (
                        completedLotteries.map(lottery => (
                          <TableRow key={lottery.id}>
                            <TableCell className="font-medium">{lottery.name}</TableCell>
                            <TableCell>{new Date(lottery.drawDate).toLocaleDateString()}</TableCell>
                            <TableCell>${lottery.price.toFixed(2)}</TableCell>
                            <TableCell>${lottery.jackpot.toLocaleString()}</TableCell>
                            <TableCell>
                              {lottery.winningTicket ? (
                                <span className="font-mono">{lottery.winningTicket}</span>
                              ) : (
                                <span className="text-muted-foreground">No winner</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/lottery/${lottery.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No completed lotteries found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_USERS.map(mockUser => (
                        <TableRow key={mockUser.id}>
                          <TableCell className="font-medium">{mockUser.username}</TableCell>
                          <TableCell>{mockUser.email}</TableCell>
                          <TableCell>
                            <Badge variant={mockUser.role === 'admin' ? 'default' : 'outline'}>
                              {mockUser.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(mockUser.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Management</CardTitle>
                  <CardDescription>
                    All lottery tickets in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-8 rounded-md text-center">
                    <p className="text-muted-foreground">
                      Ticket management functionality coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPanel;
