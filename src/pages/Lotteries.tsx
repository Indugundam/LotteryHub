import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useLottery, Lottery } from '@/context/LotteryContext';

const Lotteries = () => {
  const { lotteries } = useLottery();
  const [searchTerm, setSearchTerm] = useState('');

  // Separate active and past lotteries
  const activeLotteries = useMemo(() => 
    lotteries.filter((lottery) => lottery.status === 'active')
  , [lotteries]);
  
  const completedLotteries = useMemo(() => 
    lotteries.filter((lottery) => lottery.status === 'drawn')
  , [lotteries]);

  // Filter lotteries based on search term
  const filteredActive = useMemo(() => 
    activeLotteries.filter((lottery) => 
      lottery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lottery.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [activeLotteries, searchTerm]);

  const filteredCompleted = useMemo(() => 
    completedLotteries.filter((lottery) => 
      lottery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lottery.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [completedLotteries, searchTerm]);

  const renderLotteryCard = (lottery: Lottery) => (
    <Card key={lottery.id} className="h-full transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>{lottery.name}</CardTitle>
        <CardDescription className="line-clamp-2">{lottery.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jackpot:</span>
            <span className="font-semibold">${lottery.jackpot?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ticket Price:</span>
            <span>${lottery.price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Draw Date:</span>
            <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
          </div>
          {lottery.status === 'drawn' && lottery.winningTicket && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Winning Ticket:</span>
              <span className="font-medium">{lottery.winningTicket}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/lotteries/${lottery.id}`}>
            {lottery.status === 'active' ? (
              <>
                Buy Ticket
                <ArrowRight size={16} className="ml-2" />
              </>
            ) : (
              'View Details'
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Lotteries</h1>
          <p className="text-muted-foreground">
            Browse our selection of active and past lotteries. Purchase tickets for active draws or view results for completed ones.
          </p>
        </div>

        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search lotteries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="active">
                Active Lotteries ({filteredActive.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Past Lotteries ({filteredCompleted.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active">
            {filteredActive.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredActive.map(renderLotteryCard)}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No active lotteries match your search.' : 'There are no active lotteries at the moment.'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {filteredCompleted.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredCompleted.map(renderLotteryCard)}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No past lotteries match your search.' : 'There are no past lotteries to display.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Lotteries;
