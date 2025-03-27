
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Trophy } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useLottery, Lottery } from '@/context/LotteryContext';

const Results = () => {
  const { lotteries } = useLottery();
  const [searchTerm, setSearchTerm] = useState('');

  // Get only completed lotteries
  const completedLotteries = useMemo(() => 
    lotteries.filter((lottery) => lottery.status === 'drawn')
      .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime())
  , [lotteries]);

  // Filter lotteries based on search
  const filteredLotteries = useMemo(() => 
    completedLotteries.filter((lottery) => 
      lottery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lottery.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [completedLotteries, searchTerm]);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Lottery Results</h1>
          <p className="text-muted-foreground">
            Check out the results of our previous lottery draws. See the winning numbers and jackpot amounts.
          </p>
        </div>

        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredLotteries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredLotteries.map((lottery) => (
              <Card key={lottery.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    {lottery.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Draw Date:</span>
                      <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jackpot:</span>
                      <span className="font-semibold">${lottery.jackpot.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Winning Ticket:</span>
                      <span className="font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {lottery.winningTicket}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/lotteries/${lottery.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium mb-2">No Results Found</p>
            <p className="text-muted-foreground">
              {searchTerm ? 'No lottery results match your search criteria.' : 'There are no completed lotteries yet.'}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Results;
