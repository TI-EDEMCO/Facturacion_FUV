package com.microservice_security.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.microservice_security.service.CustomUserDetailsService;
import com.microservice_security.service.JwtService;

import jakarta.servlet.http.HttpSession;

@Configuration
@EnableWebSecurity
public class AuthConfig {
    @Autowired
    private  JwtService jwtService;

    /**
     * Configura la cadena de filtros de seguridad.
     *
     * @param http configuración de seguridad HTTP.
     * @return la cadena de filtros de seguridad configurada.
     * @throws Exception si ocurre algún error durante la configuración.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .oauth2Login(oauth -> oauth.successHandler(authenticationSuccesHandler()))
                .build();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccesHandler(){
        return (request,response,authentication)->{
            HttpSession session= request.getSession(true);
            //se aumenta el tiempo de inactivadad para solititar token de envio de correo. 9 horas 
            session.setMaxInactiveInterval(32400);
            String sessionId=session.getId();
            session.setAttribute("authentication", authentication);
            OidcUser oidcUser=(OidcUser) authentication.getPrincipal();
            String email=oidcUser.getEmail();
            session.setAttribute("username",email);
            String token = jwtService.generateToken(email,sessionId);
            ResponseCookie cookie=ResponseCookie.from("accessToken",token)
            .httpOnly(false)
            .secure(false)
            .path("/")
            .maxAge(Duration.ofHours(9))
            .sameSite("Lax")
            .build();

            response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());

            response.sendRedirect("https://192.168.56.1:5173/principal");
        };
    }
    /**
     * Proporciona el administrador de autenticación.
     *
     * @param authenticationConfiguration configuración de autenticación.
     * @return el administrador de autenticación configurado.
     * @throws Exception si ocurre algún error durante la inicialización.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    
    /**
     * Proporciona un servicio para la gestión de los detalles de usuario.
     *
     * @return una instancia de CustomUserDetailsService.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    /**
     * Configura el proveedor de autenticación basado en DAO.
     *
     * @return el proveedor de autenticación configurado.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    /**
     * Proporciona un codificador de contraseñas basado en BCrypt.
     *
     * @return el codificador de contraseñas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(false);
            }
        };
    }
}
