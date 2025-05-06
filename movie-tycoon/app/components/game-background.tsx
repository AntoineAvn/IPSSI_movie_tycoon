"use client"

import { useEffect, useRef } from "react"

export function GameBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 80

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 2.5 + 0.5
        this.speedX = Math.random() * 0.7 - 0.35
        this.speedY = Math.random() * 0.7 - 0.35
        
        // Palette de couleurs cinéma : tons jaune, orange, rouge
        const colors = [
          `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})`,    // Or
          `rgba(255, 165, 0, ${Math.random() * 0.3 + 0.1})`,    // Orange
          `rgba(255, 99, 71, ${Math.random() * 0.3 + 0.1})`,    // Tomate
          `rgba(255, 140, 0, ${Math.random() * 0.3 + 0.1})`,    // Orange foncé
          `rgba(255, 69, 0, ${Math.random() * 0.3 + 0.1})`,     // Rouge-orangé
        ]
        
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas!.width) this.x = 0
        else if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        else if (this.y < 0) this.y = canvas!.height
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      
      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    init()
    animate()

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-[-5]"
    />
  )
} 