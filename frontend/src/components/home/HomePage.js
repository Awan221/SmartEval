"use client"
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  Divider,
  useTheme,
} from "@mui/material"
import {
  Assessment as AssessmentIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import HomeNavbar from "../../components/home/HomeNavbar"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const theme = useTheme()

  return (
    <Box>
      <HomeNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  letterSpacing: "-0.5px",
                }}
              >
                SmartEval
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mb: 4,
                  fontWeight: 300,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Évaluer avec intelligence, former avec excellence
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Une plateforme innovante d'évaluation automatique propulsée par l'intelligence artificielle.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {isAuthenticated ? (
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Accéder au tableau de bord
                  </Button>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Se connecter
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      S'inscrire
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 450,
                    height: 300,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      opacity: 0.7,
                      zIndex: -1,
                    },
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    Évaluation intelligente
                  </Typography>
                  <Typography variant="body1" align="center">
                    Notre IA analyse vos exercices et fournit un feedback détaillé pour améliorer vos compétences.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Pourquoi choisir SmartEval ?
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
        >
          Notre plateforme combine intelligence artificielle et expertise pédagogique pour offrir une expérience
          d'évaluation inégalée.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <SpeedIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  Évaluation rapide
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Obtenez des résultats instantanés grâce à notre système d'évaluation automatique, permettant un
                  feedback immédiat.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <AutoAwesomeIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  Intelligence artificielle
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Notre IA avancée analyse en profondeur les réponses pour fournir une évaluation précise et des
                  conseils personnalisés.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <AssessmentIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  Analyses détaillées
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Accédez à des rapports complets sur les performances, identifiant les forces et les axes
                  d'amélioration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Fonctionnalités principales
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" paragraph sx={{ mb: 6 }}>
            Découvrez comment SmartEval transforme l'évaluation des exercices techniques
          </Typography>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h4" component="h3" gutterBottom color="primary.main">
                  Évaluation des bases de données
                </Typography>
                <Typography variant="body1" paragraph>
                  Notre plateforme excelle dans l'évaluation des exercices SQL et de conception de bases de données,
                  avec une analyse précise des requêtes et des schémas.
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">Analyse syntaxique et sémantique des requêtes SQL</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">Évaluation de l'efficacité et de l'optimisation</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">
                      Feedback détaillé sur les erreurs et améliorations possibles
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ fontFamily: "inherit", m: 0 }}>
                    {`SELECT e.nom, e.prénom
FROM Étudiants e
JOIN Inscriptions i ON e.id = i.id_etudiant
WHERE i.note > 15
GROUP BY e.id, e.nom, e.prénom
HAVING COUNT(DISTINCT i.id_cours) >= 2
ORDER BY e.nom ASC;`}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Évaluation: 18/20
                  </Typography>
                  <Typography variant="body2">
                    Requête correcte et optimisée. Bonne utilisation du GROUP BY avec les champs appropriés et du HAVING
                    pour filtrer les résultats agrégés.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          <Grid container spacing={6} alignItems="center" direction={{ xs: "column-reverse", md: "row" }}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
                  <Typography variant="h6">Rapport d'évaluation</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Performance globale
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: "grey.200",
                        borderRadius: 4,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: "85%",
                          bgcolor: "success.main",
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      85% de réussite
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Points forts
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Excellente maîtrise des jointures
                      <br />• Bonne compréhension des fonctions d'agrégation
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Axes d'amélioration
                    </Typography>
                    <Typography variant="body2">
                      • Optimisation des sous-requêtes
                      <br />• Utilisation des index
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h4" component="h3" gutterBottom color="primary.main">
                  Rapports détaillés
                </Typography>
                <Typography variant="body1" paragraph>
                  SmartEval fournit des rapports d'évaluation complets qui identifient précisément les forces et les
                  faiblesses, permettant un apprentissage ciblé et efficace.
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">Analyse détaillée de chaque réponse</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">Identification des concepts maîtrisés et à améliorer</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body1">Recommandations personnalisées pour progresser</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Comment ça marche
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" paragraph sx={{ mb: 6 }}>
          Un processus simple et efficace pour évaluer les compétences techniques
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                    fontWeight: "bold",
                  }}
                >
                  1
                </Box>
                <Typography variant="h5" component="h3">
                  Création d'examens
                </Typography>
              </Box>
              <Typography variant="body1">
                Les professeurs créent des examens avec des questions spécifiques et définissent les critères
                d'évaluation. Notre système IA comprend les objectifs pédagogiques.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                    fontWeight: "bold",
                  }}
                >
                  2
                </Box>
                <Typography variant="h5" component="h3">
                  Soumission des réponses
                </Typography>
              </Box>
              <Typography variant="body1">
                Les étudiants soumettent leurs solutions via la plateforme. Le système accepte différents formats et
                extrait intelligemment le contenu pour l'évaluation.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                    fontWeight: "bold",
                  }}
                >
                  3
                </Box>
                <Typography variant="h5" component="h3">
                  Évaluation et feedback
                </Typography>
              </Box>
              <Typography variant="body1">
                Notre IA analyse les réponses, attribue des notes et fournit un feedback détaillé. Les professeurs
                peuvent consulter les résultats et ajouter leurs commentaires.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.dark", color: "white", py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Prêt à transformer votre approche d'évaluation ?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Rejoignez SmartEval dès aujourd'hui et découvrez la puissance de l'évaluation intelligente
          </Typography>

          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Accéder au tableau de bord
            </Button>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Créer un compte
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Se connecter
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                SmartEval
              </Typography>
              <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                Évaluer avec intelligence, former avec excellence
              </Typography>
              <Typography variant="body2" color="grey.400">
                Notre plateforme d'évaluation intelligente utilise l'IA pour fournir un feedback précis et personnalisé,
                aidant les étudiants à progresser et les professeurs à optimiser leur enseignement.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Liens rapides
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography
                    component={RouterLink}
                    to="/"
                    variant="body2"
                    color="grey.400"
                    sx={{ textDecoration: "none", "&:hover": { color: "white" } }}
                  >
                    Accueil
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    color="grey.400"
                    sx={{ textDecoration: "none", "&:hover": { color: "white" } }}
                  >
                    Connexion
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    color="grey.400"
                    sx={{ textDecoration: "none", "&:hover": { color: "white" } }}
                  >
                    Inscription
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="grey.400" paragraph>
                Vous avez des questions ? N'hésitez pas à nous contacter.
              </Typography>
              <Typography variant="body2" color="grey.400">
                Email: contact@smarteval.com
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: "grey.800" }} />

          <Typography variant="body2" color="grey.500" align="center">
            © {new Date().getFullYear()} SmartEval. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

