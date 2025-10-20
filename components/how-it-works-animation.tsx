'use client'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Sparkles, ListMusic } from "lucide-react"
import { motion } from "framer-motion"

// Este componente es una animación visual que demuestra el proceso de 3 pasos.
export function HowItWorksAnimation() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.5, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mt-8 mb-16 p-4 bg-background/50 rounded-lg border border-dashed border-border"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="grid md:grid-cols-3 gap-6 items-start text-center">
        {/* Step 1: Input */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-semibold mb-2">1. Describe tu emoción</h3>
          <div className="w-full p-2 bg-muted rounded-lg">
            <Textarea 
              readOnly
              value="Me siento con energía y optimismo para un nuevo comienzo."
              className="text-sm text-center resize-none h-24 border-none shadow-inner bg-background/70"
            />
          </div>
        </motion.div>

        {/* Arrow / Process */}
        <motion.div variants={itemVariants} className="flex items-center justify-center h-full pt-10 md:pt-0">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            > 
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </motion.div>
        </motion.div>

        {/* Step 3: Output */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
            <ListMusic className="h-8 w-8" />
          </div>
          <h3 className="font-semibold mb-2">2. Recibe tu Playlist</h3>
          <Card className="w-full shadow-inner bg-background/70">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">"Walking on Sunshine"</p>
                  <p className="text-xs text-muted-foreground">Katrina & The Waves</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">"Mr. Blue Sky"</p>
                  <p className="text-xs text-muted-foreground">Electric Light Orchestra</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">"Here Comes The Sun"</p>
                  <p className="text-xs text-muted-foreground">The Beatles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
