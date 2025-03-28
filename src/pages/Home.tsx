import React from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '@/context/LotteryContext';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Trophy, Ticket } from 'lucide-react';
const Home = () => {
  const {
    lotteries
  } = useLottery();

  // Filter active lotteries for the featured section
  const activeLotteries = lotteries.filter(lottery => lottery.status === 'active');
  return <PageTransition>
      <div className="container mx-auto px-4 py-8">
      {/* Hero Banner Section */}
      <section className="relative h-[400px] rounded-xl overflow-hidden mb-16 mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Lottery Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md">Lottery Hub</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 drop-shadow-sm">
              Your destination for exciting lotteries with life-changing prizes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/lotteries">Browse Lotteries</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/20 font-semibold">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Welcome to Lottery Hub</h2>
          <p className="text-muted-foreground mb-8">
            Your destination for exciting lotteries with life-changing prizes. 
            Browse our collection of lotteries, buy tickets, and try your luck today!
          </p>
        </section>
        
        {activeLotteries.length > 0 && <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Featured Lotteries</h2>
              <Button asChild variant="ghost" className="group">
                <Link to="/lotteries" className="flex items-center">
                  View All 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeLotteries.slice(0, 3).map(lottery => <Card key={lottery.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video relative">
                    <img src={lottery.image || '/placeholder.svg'} alt={lottery.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2">
                      {lottery.status === 'active' ? 'Active' : lottery.status === 'upcoming' ? 'Upcoming' : 'Drawn'}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{lottery.name}</h3>
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <Trophy size={18} className="mr-2 text-primary" />
                        <span>${lottery.prizeAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Ticket size={18} className="mr-2 text-primary" />
                        <span>${lottery.ticketPrice}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{lottery.description}</p>
                    <Button asChild className="w-full">
                      <Link to={`/lottery/${lottery.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
          </section>}
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Select a Lottery</h3>
              <p className="text-muted-foreground">
                Browse our range of lotteries and choose the one that catches your interest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Purchase Tickets</h3>
              <p className="text-muted-foreground">
                Buy your tickets securely and receive instant confirmation of your entry.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
              <p className="text-muted-foreground">
                Wait for the draw date and check if you've won one of our amazing prizes.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Try Your Luck?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Join thousands of winners who have already claimed their prizes.
              Your winning ticket could be just a click away!
            </p>
            <Button asChild size="lg">
              <Link to="/lotteries">Buy Tickets Now</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageTransition>;
};
export default Home;