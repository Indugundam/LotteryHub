
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock, Trophy, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About LotteryHub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted platform for online lottery games and results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader className="text-center pb-2">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Big Jackpots</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Win life-changing amounts with our massive jackpots up to $10 million.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center pb-2">
                <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Regular Draws</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Multiple draws happening daily, weekly, and monthly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center pb-2">
                <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle>Growing Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Join thousands of players enjoying our platform every day.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Create an Account</h3>
                  <p className="text-muted-foreground">
                    Sign up for free with your email address and create a secure password.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Choose a Lottery</h3>
                  <p className="text-muted-foreground">
                    Browse our various lotteries with different jackpots and odds.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Purchase Tickets</h3>
                  <p className="text-muted-foreground">
                    Buy tickets securely through our platform with multiple payment options.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Get Results</h3>
                  <p className="text-muted-foreground">
                    Check the results after the draw and collect your winnings if you're lucky!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Why Choose LotteryHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>Secure platform with end-to-end encryption</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>Higher odds of winning compared to traditional lotteries</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>Instant notifications for draws and wins</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>Fair and transparent drawing process</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>24/7 customer support</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p>Fast and secure payment methods</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Try Your Luck?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join thousands of players and start playing today. You could be our next big winner!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/lotteries">
                  View Lotteries
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
