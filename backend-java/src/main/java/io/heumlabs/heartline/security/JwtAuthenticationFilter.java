package io.heumlabs.heartline.security;

import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * 요청마다 Bearer 액세스 토큰을 검증해 SecurityContext 를 채운다.
 * api/auth.py 의 get_current_user 대응:
 * <ul>
 *   <li>refresh 토큰(type=refresh)으로는 인증하지 않는다.</li>
 *   <li>비활성(is_active=false) 사용자는 거부한다.</li>
 *   <li>만료/무효는 사유를 request attribute 에 기록해 EntryPoint 가 메시지를 분기한다.</li>
 * </ul>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String ATTR_AUTH_ERROR = "jwt_auth_error";
    public static final String ERROR_EXPIRED = "expired";
    public static final String ERROR_INVALID = "invalid";

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(BEARER_PREFIX.length());
        try {
            Claims claims = tokenProvider.parse(token);

            // refresh 토큰은 API 인증 용도로 사용 불가
            if (tokenProvider.isRefreshToken(claims)) {
                request.setAttribute(ATTR_AUTH_ERROR, ERROR_INVALID);
                filterChain.doFilter(request, response);
                return;
            }

            UUID userId = UUID.fromString(claims.getSubject());
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || !user.isActive()) {
                request.setAttribute(ATTR_AUTH_ERROR, ERROR_INVALID);
                filterChain.doFilter(request, response);
                return;
            }

            var authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (ExpiredJwtException e) {
            request.setAttribute(ATTR_AUTH_ERROR, ERROR_EXPIRED);
        } catch (JwtException | IllegalArgumentException e) {
            request.setAttribute(ATTR_AUTH_ERROR, ERROR_INVALID);
        }

        filterChain.doFilter(request, response);
    }
}
