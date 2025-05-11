"use client"

import { useRef, useState, useEffect } from "react"

export function BitcoinAnimation() {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Redimensionner le canvas quand la fenêtre change de taille
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialiser l'animation
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Définir la taille du canvas
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Charger l'image du Bitcoin
    const bitcoinImage = new Image()
    bitcoinImage.crossOrigin = "anonymous"
    bitcoinImage.src = "/bitcoin-blue.png"

    // Paramètres de l'animation
    const bitcoinSize = Math.min(dimensions.width, dimensions.height) * 0.3
    const bitcoinX = dimensions.width * 0.3
    const bitcoinY = dimensions.height / 2

    // Créer des particules binaires
    const binaryParticles = []
    const networkNodes = []
    const networkLines = []

    // Classe pour les particules binaires
    class Particle {
      constructor() {
        this.x = bitcoinX + (Math.random() - 0.3) * bitcoinSize
        this.y = bitcoinY + (Math.random() - 0.5) * bitcoinSize
        this.value = Math.random() > 0.5 ? "1" : "0"
        this.size = 8 + Math.random() * 10
        this.speed = 1 + Math.random() * 3
        this.opacity = 0.1 + Math.random() * 0.7
      }

      update() {
        this.x += this.speed
        this.opacity -= 0.003

        if (this.opacity <= 0 || this.x > dimensions.width) {
          this.x = bitcoinX + (Math.random() - 0.3) * bitcoinSize
          this.y = bitcoinY + (Math.random() - 0.5) * bitcoinSize
          this.opacity = 0.1 + Math.random() * 0.7
        }
      }

      draw(ctx) {
        ctx.font = `${this.size}px monospace`
        ctx.fillStyle = `rgba(0, 200, 255, ${this.opacity})`
        ctx.fillText(this.value, this.x, this.y)
      }
    }

    // Classe pour les nœuds du réseau
    class NetworkNode {
      constructor() {
        this.x = Math.random() * dimensions.width
        this.y = Math.random() * dimensions.height
        this.size = 1 + Math.random() * 3
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(100, 200, 255, 0.7)"
        ctx.fill()
      }
    }

    // Classe pour les lignes du réseau
    class NetworkLine {
      constructor(startNode, endNode) {
        this.startNode = startNode
        this.endNode = endNode
        this.opacity = 0.1 + Math.random() * 0.3
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.startNode.x, this.startNode.y)
        ctx.lineTo(this.endNode.x, this.endNode.y)
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Initialiser les particules
    for (let i = 0; i < 150; i++) {
      binaryParticles.push(new Particle())
    }

    // Initialiser les nœuds du réseau
    for (let i = 0; i < 50; i++) {
      networkNodes.push(new NetworkNode())
    }

    // Créer des connexions entre les nœuds
    for (let i = 0; i < networkNodes.length; i++) {
      for (let j = i + 1; j < networkNodes.length; j++) {
        if (Math.random() > 0.95) {
          networkLines.push(new NetworkLine(networkNodes[i], networkNodes[j]))
        }
      }
    }

    // Fonction d'animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dessiner le fond
      ctx.fillStyle = "#050b18"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dessiner les lignes du réseau
      networkLines.forEach((line) => line.draw(ctx))

      // Dessiner les nœuds du réseau
      networkNodes.forEach((node) => node.draw(ctx))

      // Dessiner l'image du Bitcoin
      if (bitcoinImage.complete && bitcoinImage.naturalHeight !== 0) {
        ctx.globalAlpha = 0.9
        ctx.drawImage(bitcoinImage, bitcoinX - bitcoinSize / 2, bitcoinY - bitcoinSize / 2, bitcoinSize, bitcoinSize)
        ctx.globalAlpha = 1
      }

      // Dessiner et mettre à jour les particules binaires
      binaryParticles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    // Gérer le chargement de l'image
    bitcoinImage.onload = () => {
      animate()
    }

    bitcoinImage.onerror = (error) => {
      console.error("Erreur de chargement de l'image:", error)
      // Démarrer l'animation même si l'image ne se charge pas
      animate()
    }

    // Si l'image est déjà en cache et chargée
    if (bitcoinImage.complete) {
      animate()
    }

    // Nettoyer l'animation lors du démontage du composant
    return () => {
      // Aucune action spécifique nécessaire pour nettoyer le canvas
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
