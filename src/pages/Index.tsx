
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Shield, Trophy, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { useLottery } from '@/context/LotteryContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { lotteries } = useLottery();
  
  // Get only active lotteries, sorted by jackpot size (largest first)
  const activeLotteries = lotteries
    .filter(lottery => lottery.status === 'active')
    .sort((a, b) => b.jackpot - a.jackpot)
    .slice(0, 3); // Get top 3

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const featuresData = [
    {
      title: "Safe & Secure",
      description: "Our platform uses advanced encryption and security measures to ensure your data remains protected.",
      icon: <Shield className="h-10 w-10 text-primary" />,
    },
    {
      title: "Real Winners",
      description: "Transparent lottery draws with real winners announced publicly on our platform.",
      icon: <Trophy className="h-10 w-10 text-primary" />,
    },
    {
      title: "Join Community",
      description: "Be part of our growing community of lottery enthusiasts and winners.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: "Exciting Prizes",
      description: "From cash to exclusive rewards, our lotteries offer something for everyone.",
      icon: <Gift className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-28 lg:py-36 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Experience the Thrill
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Your Journey to <span className="text-primary">Fortune</span> Begins Here
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              Join thousands of winners on our state-of-the-art lottery platform. 
              Simple, transparent, and designed for an exceptional user experience.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-8 font-medium">
                <Link to="/lotteries">
                  Browse Lotteries
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-medium">
                  <Link to="/register">Create Account</Link>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Lotteries */}
      <section className="py-16 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Active Lotteries</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of active lotteries with exciting prizes waiting to be won.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeLotteries.map((lottery) => (
              <motion.div key={lottery.id} variants={itemVariants}>
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle>{lottery.name}</CardTitle>
                    <CardDescription>{lottery.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Jackpot:</span>
                        <span className="font-semibold text-lg">${lottery.jackpot.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ticket Price:</span>
                        <span>${lottery.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Draw Date:</span>
                        <span>{new Date(lottery.drawDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/lotteries/${lottery.id}`}>
                        Buy Ticket
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link to="/lotteries">View All Lotteries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 mt-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've designed LotteryHub with our users in mind, combining security, transparency, and user experience.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuresData.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mt-8 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Ready to Try Your Luck?</h2>
              <p className="text-white/90 max-w-md">
                Join thousands of players and start your journey to winning big today.
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild size="lg" variant="secondary" className="font-medium">
                <Link to="/lotteries">Browse Lotteries</Link>
              </Button>
              
              {!isAuthenticated && (
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 font-medium">
                  <Link to="/register">Sign Up Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
