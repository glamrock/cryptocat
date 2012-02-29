
bpe=0;mask=0;radix=mask+1;digitsStr='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/?`~ \\\'\"+-';for(bpe=0;(1<<(bpe+1))>(1<<bpe);bpe++);bpe>>=1;mask=(1<<bpe)-1;radix=mask+1;one=int2bigInt(1,1,1);t=new Array(0);ss=t;s0=t;s1=t;s2=t;s3=t;s4=t;s5=t;s6=t;s7=t;T=t;sa=t;mr_x1=t;mr_r=t;mr_a=t;eg_v=t;eg_u=t;eg_A=t;eg_B=t;eg_C=t;eg_D=t;md_q1=t;md_q2=t;md_q3=t;md_r=t;md_r1=t;md_r2=t;md_tt=t;primes=t;pows=t;s_i=t;s_i2=t;s_R=t;s_rm=t;s_q=t;s_n1=t;s_a=t;s_r2=t;s_n=t;s_b=t;s_d=t;s_x1=t;s_x2=t,s_aa=t;rpprb=t;function findPrimes(n){var i,s,p,ans;s=new Array(n);for(i=0;i<n;i++)
s[i]=0;s[0]=2;p=0;for(;s[p]<n;){for(i=s[p]*s[p];i<n;i+=s[p])
s[i]=1;p++;s[p]=s[p-1]+1;for(;s[p]<n&&s[s[p]];s[p]++);}
ans=new Array(p);for(i=0;i<p;i++)
ans[i]=s[i];return ans;}
function millerRabinInt(x,b){if(mr_x1.length!=x.length){mr_x1=dup(x);mr_r=dup(x);mr_a=dup(x);}
copyInt_(mr_a,b);return millerRabin(x,mr_a);}
function millerRabin(x,b){var i,j,k,s;if(mr_x1.length!=x.length){mr_x1=dup(x);mr_r=dup(x);mr_a=dup(x);}
copy_(mr_a,b);copy_(mr_r,x);copy_(mr_x1,x);addInt_(mr_r,-1);addInt_(mr_x1,-1);k=0;for(i=0;i<mr_r.length;i++)
for(j=1;j<mask;j<<=1)
if(x[i]&j){s=(k<mr_r.length+bpe?k:0);i=mr_r.length;j=mask;}else
k++;if(s)
rightShift_(mr_r,s);powMod_(mr_a,mr_r,x);if(!equalsInt(mr_a,1)&&!equals(mr_a,mr_x1)){j=1;while(j<=s-1&&!equals(mr_a,mr_x1)){squareMod_(mr_a,x);if(equalsInt(mr_a,1)){return 0;}
j++;}
if(!equals(mr_a,mr_x1)){return 0;}}
return 1;}
function bitSize(x){var j,z,w;for(j=x.length-1;(x[j]==0)&&(j>0);j--);for(z=0,w=x[j];w;(w>>=1),z++);z+=bpe*j;return z;}
function expand(x,n){var ans=int2bigInt(0,(x.length>n?x.length:n)*bpe,0);copy_(ans,x);return ans;}
function randTruePrime(k){var ans=int2bigInt(0,k,0);randTruePrime_(ans,k);return trim(ans,1);}
function randProbPrime(k){if(k>=600)return randProbPrimeRounds(k,2);if(k>=550)return randProbPrimeRounds(k,4);if(k>=500)return randProbPrimeRounds(k,5);if(k>=400)return randProbPrimeRounds(k,6);if(k>=350)return randProbPrimeRounds(k,7);if(k>=300)return randProbPrimeRounds(k,9);if(k>=250)return randProbPrimeRounds(k,12);if(k>=200)return randProbPrimeRounds(k,15);if(k>=150)return randProbPrimeRounds(k,18);if(k>=100)return randProbPrimeRounds(k,27);return randProbPrimeRounds(k,40);}
function randProbPrimeRounds(k,n){var ans,i,divisible,B;B=30000;ans=int2bigInt(0,k,0);if(primes.length==0)
primes=findPrimes(30000);if(rpprb.length!=ans.length)
rpprb=dup(ans);for(;;){randBigInt_(ans,k,0);ans[0]|=1;divisible=0;for(i=0;(i<primes.length)&&(primes[i]<=B);i++)
if(modInt(ans,primes[i])==0&&!equalsInt(ans,primes[i])){divisible=1;break;}
for(i=0;i<n&&!divisible;i++){randBigInt_(rpprb,k,0);while(!greater(ans,rpprb))
randBigInt_(rpprb,k,0);if(!millerRabin(ans,rpprb))
divisible=1;}
if(!divisible)
return ans;}}
function mod(x,n){var ans=dup(x);mod_(ans,n);return trim(ans,1);}
function addInt(x,n){var ans=expand(x,x.length+1);addInt_(ans,n);return trim(ans,1);}
function mult(x,y){var ans=expand(x,x.length+y.length);mult_(ans,y);return trim(ans,1);}
function powMod(x,y,n){var ans=expand(x,n.length);powMod_(ans,trim(y,2),trim(n,2),0);return trim(ans,1);}
function sub(x,y){var ans=expand(x,(x.length>y.length?x.length+1:y.length+1));sub_(ans,y);return trim(ans,1);}
function add(x,y){var ans=expand(x,(x.length>y.length?x.length+1:y.length+1));add_(ans,y);return trim(ans,1);}
function inverseMod(x,n){var ans=expand(x,n.length);var s;s=inverseMod_(ans,n);return s?trim(ans,1):null;}
function multMod(x,y,n){var ans=expand(x,n.length);multMod_(ans,y,n);return trim(ans,1);}
function randTruePrime_(ans,k){var c,m,pm,dd,j,r,B,divisible,z,zz,recSize;if(primes.length==0)
primes=findPrimes(30000);if(pows.length==0){pows=new Array(512);for(j=0;j<512;j++){pows[j]=Math.pow(2,j/511.-1.);}}
c=0.1;m=20;recLimit=20;if(s_i2.length!=ans.length){s_i2=dup(ans);s_R=dup(ans);s_n1=dup(ans);s_r2=dup(ans);s_d=dup(ans);s_x1=dup(ans);s_x2=dup(ans);s_b=dup(ans);s_n=dup(ans);s_i=dup(ans);s_rm=dup(ans);s_q=dup(ans);s_a=dup(ans);s_aa=dup(ans);}
if(k<=recLimit){pm=(1<<((k+2)>>1))-1;copyInt_(ans,0);for(dd=1;dd;){dd=0;ans[0]=1|(1<<(k-1))|Math.floor(Math.random()*(1<<k));for(j=1;(j<primes.length)&&((primes[j]&pm)==primes[j]);j++){if(0==(ans[0]%primes[j])){dd=1;break;}}}
carry_(ans);return;}
B=c*k*k;if(k>2*m)
for(r=1;k-k*r<=m;)
r=pows[Math.floor(Math.random()*512)];else
r=.5;recSize=Math.floor(r*k)+1;randTruePrime_(s_q,recSize);copyInt_(s_i2,0);s_i2[Math.floor((k-2)/bpe)]|=(1<<((k-2)%bpe));divide_(s_i2,s_q,s_i,s_rm);z=bitSize(s_i);for(;;){for(;;){randBigInt_(s_R,z,0);if(greater(s_i,s_R))
break;}
addInt_(s_R,1);add_(s_R,s_i);copy_(s_n,s_q);mult_(s_n,s_R);multInt_(s_n,2);addInt_(s_n,1);copy_(s_r2,s_R);multInt_(s_r2,2);for(divisible=0,j=0;(j<primes.length)&&(primes[j]<B);j++)
if(modInt(s_n,primes[j])==0&&!equalsInt(s_n,primes[j])){divisible=1;break;}
if(!divisible)
if(!millerRabinInt(s_n,2))
divisible=1;if(!divisible){addInt_(s_n,-3);for(j=s_n.length-1;(s_n[j]==0)&&(j>0);j--);for(zz=0,w=s_n[j];w;(w>>=1),zz++);zz+=bpe*j;for(;;){randBigInt_(s_a,zz,0);if(greater(s_n,s_a))
break;}
addInt_(s_n,3);addInt_(s_a,2);copy_(s_b,s_a);copy_(s_n1,s_n);addInt_(s_n1,-1);powMod_(s_b,s_n1,s_n);addInt_(s_b,-1);if(isZero(s_b)){copy_(s_b,s_a);powMod_(s_b,s_r2,s_n);addInt_(s_b,-1);copy_(s_aa,s_n);copy_(s_d,s_b);GCD_(s_d,s_n);if(equalsInt(s_d,1)){copy_(ans,s_aa);return;}}}}}
function randBigInt(n,s){var a,b;a=Math.floor((n-1)/bpe)+2;b=int2bigInt(0,0,a);randBigInt_(b,n,s);return b;}
function randBigInt_(b,n,s){var i,a;for(i=0;i<b.length;i++)
b[i]=0;a=Math.floor((n-1)/bpe)+1;for(i=0;i<a;i++){b[i]=Math.floor(Math.random()*(1<<(bpe-1)));}
b[a-1]&=(2<<((n-1)%bpe))-1;if(s==1)
b[a-1]|=(1<<((n-1)%bpe));}
function GCD(x,y){var xc,yc;xc=dup(x);yc=dup(y);GCD_(xc,yc);return xc;}
function GCD_(x,y){var i,xp,yp,A,B,C,D,q,sing;if(T.length!=x.length)
T=dup(x);sing=1;while(sing){sing=0;for(i=1;i<y.length;i++)
if(y[i]){sing=1;break;}
if(!sing)break;for(i=x.length;!x[i]&&i>=0;i--);xp=x[i];yp=y[i];A=1;B=0;C=0;D=1;while((yp+C)&&(yp+D)){q=Math.floor((xp+A)/(yp+C));qp=Math.floor((xp+B)/(yp+D));if(q!=qp)
break;t=A-q*C;A=C;C=t;t=B-q*D;B=D;D=t;t=xp-q*yp;xp=yp;yp=t;}
if(B){copy_(T,x);linComb_(x,y,A,B);linComb_(y,T,D,C);}else{mod_(x,y);copy_(T,x);copy_(x,y);copy_(y,T);}}
if(y[0]==0)
return;t=modInt(x,y[0]);copyInt_(x,y[0]);y[0]=t;while(y[0]){x[0]%=y[0];t=x[0];x[0]=y[0];y[0]=t;}}
function inverseMod_(x,n){var k=1+2*Math.max(x.length,n.length);if(!(x[0]&1)&&!(n[0]&1)){copyInt_(x,0);return 0;}
if(eg_u.length!=k){eg_u=new Array(k);eg_v=new Array(k);eg_A=new Array(k);eg_B=new Array(k);eg_C=new Array(k);eg_D=new Array(k);}
copy_(eg_u,x);copy_(eg_v,n);copyInt_(eg_A,1);copyInt_(eg_B,0);copyInt_(eg_C,0);copyInt_(eg_D,1);for(;;){while(!(eg_u[0]&1)){halve_(eg_u);if(!(eg_A[0]&1)&&!(eg_B[0]&1)){halve_(eg_A);halve_(eg_B);}else{add_(eg_A,n);halve_(eg_A);sub_(eg_B,x);halve_(eg_B);}}
while(!(eg_v[0]&1)){halve_(eg_v);if(!(eg_C[0]&1)&&!(eg_D[0]&1)){halve_(eg_C);halve_(eg_D);}else{add_(eg_C,n);halve_(eg_C);sub_(eg_D,x);halve_(eg_D);}}
if(!greater(eg_v,eg_u)){sub_(eg_u,eg_v);sub_(eg_A,eg_C);sub_(eg_B,eg_D);}else{sub_(eg_v,eg_u);sub_(eg_C,eg_A);sub_(eg_D,eg_B);}
if(equalsInt(eg_u,0)){if(negative(eg_C))
add_(eg_C,n);copy_(x,eg_C);if(!equalsInt(eg_v,1)){copyInt_(x,0);return 0;}
return 1;}}}
function inverseModInt(x,n){var a=1,b=0,t;for(;;){if(x==1)return a;if(x==0)return 0;b-=a*Math.floor(n/x);n%=x;if(n==1)return b;if(n==0)return 0;a-=b*Math.floor(x/n);x%=n;}}
function inverseModInt_(x,n){return inverseModInt(x,n);}
function eGCD_(x,y,v,a,b){var g=0;var k=Math.max(x.length,y.length);if(eg_u.length!=k){eg_u=new Array(k);eg_A=new Array(k);eg_B=new Array(k);eg_C=new Array(k);eg_D=new Array(k);}
while(!(x[0]&1)&&!(y[0]&1)){halve_(x);halve_(y);g++;}
copy_(eg_u,x);copy_(v,y);copyInt_(eg_A,1);copyInt_(eg_B,0);copyInt_(eg_C,0);copyInt_(eg_D,1);for(;;){while(!(eg_u[0]&1)){halve_(eg_u);if(!(eg_A[0]&1)&&!(eg_B[0]&1)){halve_(eg_A);halve_(eg_B);}else{add_(eg_A,y);halve_(eg_A);sub_(eg_B,x);halve_(eg_B);}}
while(!(v[0]&1)){halve_(v);if(!(eg_C[0]&1)&&!(eg_D[0]&1)){halve_(eg_C);halve_(eg_D);}else{add_(eg_C,y);halve_(eg_C);sub_(eg_D,x);halve_(eg_D);}}
if(!greater(v,eg_u)){sub_(eg_u,v);sub_(eg_A,eg_C);sub_(eg_B,eg_D);}else{sub_(v,eg_u);sub_(eg_C,eg_A);sub_(eg_D,eg_B);}
if(equalsInt(eg_u,0)){if(negative(eg_C)){add_(eg_C,y);sub_(eg_D,x);}
multInt_(eg_D,-1);copy_(a,eg_C);copy_(b,eg_D);leftShift_(v,g);return;}}}
function negative(x){return((x[x.length-1]>>(bpe-1))&1);}
function greaterShift(x,y,shift){var i,kx=x.length,ky=y.length;k=((kx+shift)<ky)?(kx+shift):ky;for(i=ky-1-shift;i<kx&&i>=0;i++)
if(x[i]>0)
return 1;for(i=kx-1+shift;i<ky;i++)
if(y[i]>0)
return 0;for(i=k-1;i>=shift;i--)
if(x[i-shift]>y[i])return 1;else if(x[i-shift]<y[i])return 0;return 0;}
function greater(x,y){var i;var k=(x.length<y.length)?x.length:y.length;for(i=x.length;i<y.length;i++)
if(y[i])
return 0;for(i=y.length;i<x.length;i++)
if(x[i])
return 1;for(i=k-1;i>=0;i--)
if(x[i]>y[i])
return 1;else if(x[i]<y[i])
return 0;return 0;}
function divide_(x,y,q,r){var kx,ky;var i,j,y1,y2,c,a,b;copy_(r,x);for(ky=y.length;y[ky-1]==0;ky--);b=y[ky-1];for(a=0;b;a++)
b>>=1;a=bpe-a;leftShift_(y,a);leftShift_(r,a);for(kx=r.length;r[kx-1]==0&&kx>ky;kx--);copyInt_(q,0);while(!greaterShift(y,r,kx-ky)){subShift_(r,y,kx-ky);q[kx-ky]++;}
for(i=kx-1;i>=ky;i--){if(r[i]==y[ky-1])
q[i-ky]=mask;else
q[i-ky]=Math.floor((r[i]*radix+r[i-1])/y[ky-1]);for(;;){y2=(ky>1?y[ky-2]:0)*q[i-ky];c=y2>>bpe;y2=y2&mask;y1=c+q[i-ky]*y[ky-1];c=y1>>bpe;y1=y1&mask;if(c==r[i]?y1==r[i-1]?y2>(i>1?r[i-2]:0):y1>r[i-1]:c>r[i])
q[i-ky]--;else
break;}
linCombShift_(r,y,-q[i-ky],i-ky);if(negative(r)){addShift_(r,y,i-ky);q[i-ky]--;}}
rightShift_(y,a);rightShift_(r,a);}
function carry_(x){var i,k,c,b;k=x.length;c=0;for(i=0;i<k;i++){c+=x[i];b=0;if(c<0){b=-(c>>bpe);c+=b*radix;}
x[i]=c&mask;c=(c>>bpe)-b;}}
function modInt(x,n){var i,c=0;for(i=x.length-1;i>=0;i--)
c=(c*radix+x[i])%n;return c;}
function int2bigInt(t,bits,minSize){var i,k;k=Math.ceil(bits/bpe)+1;k=minSize>k?minSize:k;buff=new Array(k);copyInt_(buff,t);return buff;}
function str2bigInt(s,base,minSize){var d,i,j,x,y,kk;var k=s.length;if(base==-1){x=new Array(0);for(;;){y=new Array(x.length+1);for(i=0;i<x.length;i++)
y[i+1]=x[i];y[0]=parseInt(s,10);x=y;d=s.indexOf(',',0);if(d<1)
break;s=s.substring(d+1);if(s.length==0)
break;}
if(x.length<minSize){y=new Array(minSize);copy_(y,x);return y;}
return x;}
x=int2bigInt(0,base*k,0);for(i=0;i<k;i++){d=digitsStr.indexOf(s.substring(i,i+1),0);if(base<=36&&d>=36)
d-=26;if(d>=base||d<0){break;}
multInt_(x,base);addInt_(x,d);}
for(k=x.length;k>0&&!x[k-1];k--);k=minSize>k+1?minSize:k+1;y=new Array(k);kk=k<x.length?k:x.length;for(i=0;i<kk;i++)
y[i]=x[i];for(;i<k;i++)
y[i]=0;return y;}
function equalsInt(x,y){var i;if(x[0]!=y)
return 0;for(i=1;i<x.length;i++)
if(x[i])
return 0;return 1;}
function equals(x,y){var i;var k=x.length<y.length?x.length:y.length;for(i=0;i<k;i++)
if(x[i]!=y[i])
return 0;if(x.length>y.length){for(;i<x.length;i++)
if(x[i])
return 0;}else{for(;i<y.length;i++)
if(y[i])
return 0;}
return 1;}
function isZero(x){var i;for(i=0;i<x.length;i++)
if(x[i])
return 0;return 1;}
function bigInt2str(x,base){var i,t,s="";if(s6.length!=x.length)
s6=dup(x);else
copy_(s6,x);if(base==-1){for(i=x.length-1;i>0;i--)
s+=x[i]+',';s+=x[0];}
else{while(!isZero(s6)){t=divInt_(s6,base);s=digitsStr.substring(t,t+1)+s;}}
if(s.length==0)
s="0";return s;}
function dup(x){var i;buff=new Array(x.length);copy_(buff,x);return buff;}
function copy_(x,y){var i;var k=x.length<y.length?x.length:y.length;for(i=0;i<k;i++)
x[i]=y[i];for(i=k;i<x.length;i++)
x[i]=0;}
function copyInt_(x,n){var i,c;for(c=n,i=0;i<x.length;i++){x[i]=c&mask;c>>=bpe;}}
function addInt_(x,n){var i,k,c,b;x[0]+=n;k=x.length;c=0;for(i=0;i<k;i++){c+=x[i];b=0;if(c<0){b=-(c>>bpe);c+=b*radix;}
x[i]=c&mask;c=(c>>bpe)-b;if(!c)return;}}
function rightShift_(x,n){var i;var k=Math.floor(n/bpe);if(k){for(i=0;i<x.length-k;i++)
x[i]=x[i+k];for(;i<x.length;i++)
x[i]=0;n%=bpe;}
for(i=0;i<x.length-1;i++){x[i]=mask&((x[i+1]<<(bpe-n))|(x[i]>>n));}
x[i]>>=n;}
function halve_(x){var i;for(i=0;i<x.length-1;i++){x[i]=mask&((x[i+1]<<(bpe-1))|(x[i]>>1));}
x[i]=(x[i]>>1)|(x[i]&(radix>>1));}
function leftShift_(x,n){var i;var k=Math.floor(n/bpe);if(k){for(i=x.length;i>=k;i--)
x[i]=x[i-k];for(;i>=0;i--)
x[i]=0;n%=bpe;}
if(!n)
return;for(i=x.length-1;i>0;i--){x[i]=mask&((x[i]<<n)|(x[i-1]>>(bpe-n)));}
x[i]=mask&(x[i]<<n);}
function multInt_(x,n){var i,k,c,b;if(!n)
return;k=x.length;c=0;for(i=0;i<k;i++){c+=x[i]*n;b=0;if(c<0){b=-(c>>bpe);c+=b*radix;}
x[i]=c&mask;c=(c>>bpe)-b;}}
function divInt_(x,n){var i,r=0,s;for(i=x.length-1;i>=0;i--){s=r*radix+x[i];x[i]=Math.floor(s/n);r=s%n;}
return r;}
function linComb_(x,y,a,b){var i,c,k,kk;k=x.length<y.length?x.length:y.length;kk=x.length;for(c=0,i=0;i<k;i++){c+=a*x[i]+b*y[i];x[i]=c&mask;c>>=bpe;}
for(i=k;i<kk;i++){c+=a*x[i];x[i]=c&mask;c>>=bpe;}}
function linCombShift_(x,y,b,ys){var i,c,k,kk;k=x.length<ys+y.length?x.length:ys+y.length;kk=x.length;for(c=0,i=ys;i<k;i++){c+=x[i]+b*y[i-ys];x[i]=c&mask;c>>=bpe;}
for(i=k;c&&i<kk;i++){c+=x[i];x[i]=c&mask;c>>=bpe;}}
function addShift_(x,y,ys){var i,c,k,kk;k=x.length<ys+y.length?x.length:ys+y.length;kk=x.length;for(c=0,i=ys;i<k;i++){c+=x[i]+y[i-ys];x[i]=c&mask;c>>=bpe;}
for(i=k;c&&i<kk;i++){c+=x[i];x[i]=c&mask;c>>=bpe;}}
function subShift_(x,y,ys){var i,c,k,kk;k=x.length<ys+y.length?x.length:ys+y.length;kk=x.length;for(c=0,i=ys;i<k;i++){c+=x[i]-y[i-ys];x[i]=c&mask;c>>=bpe;}
for(i=k;c&&i<kk;i++){c+=x[i];x[i]=c&mask;c>>=bpe;}}
function sub_(x,y){var i,c,k,kk;k=x.length<y.length?x.length:y.length;for(c=0,i=0;i<k;i++){c+=x[i]-y[i];x[i]=c&mask;c>>=bpe;}
for(i=k;c&&i<x.length;i++){c+=x[i];x[i]=c&mask;c>>=bpe;}}
function add_(x,y){var i,c,k,kk;k=x.length<y.length?x.length:y.length;for(c=0,i=0;i<k;i++){c+=x[i]+y[i];x[i]=c&mask;c>>=bpe;}
for(i=k;c&&i<x.length;i++){c+=x[i];x[i]=c&mask;c>>=bpe;}}
function mult_(x,y){var i;if(ss.length!=2*x.length)
ss=new Array(2*x.length);copyInt_(ss,0);for(i=0;i<y.length;i++)
if(y[i])
linCombShift_(ss,x,y[i],i);copy_(x,ss);}
function mod_(x,n){if(s4.length!=x.length)
s4=dup(x);else
copy_(s4,x);if(s5.length!=x.length)
s5=dup(x);divide_(s4,n,s5,x);}
function multMod_(x,y,n){var i;if(s0.length!=2*x.length)
s0=new Array(2*x.length);copyInt_(s0,0);for(i=0;i<y.length;i++)
if(y[i])
linCombShift_(s0,x,y[i],i);mod_(s0,n);copy_(x,s0);}
function squareMod_(x,n){var i,j,d,c,kx,kn,k;for(kx=x.length;kx>0&&!x[kx-1];kx--);k=kx>n.length?2*kx:2*n.length;if(s0.length!=k)
s0=new Array(k);copyInt_(s0,0);for(i=0;i<kx;i++){c=s0[2*i]+x[i]*x[i];s0[2*i]=c&mask;c>>=bpe;for(j=i+1;j<kx;j++){c=s0[i+j]+2*x[i]*x[j]+c;s0[i+j]=(c&mask);c>>=bpe;}
s0[i+kx]=c;}
mod_(s0,n);copy_(x,s0);}
function trim(x,k){var i,y;for(i=x.length;i>0&&!x[i-1];i--);y=new Array(i+k);copy_(y,x);return y;}
function powMod_(x,y,n){var k1,k2,kn,np;if(s7.length!=n.length)
s7=dup(n);if((n[0]&1)==0){copy_(s7,x);copyInt_(x,1);while(!equalsInt(y,0)){if(y[0]&1)
multMod_(x,s7,n);divInt_(y,2);squareMod_(s7,n);}
return;}
copyInt_(s7,0);for(kn=n.length;kn>0&&!n[kn-1];kn--);np=radix-inverseModInt(modInt(n,radix),radix);s7[kn]=1;multMod_(x,s7,n);if(s3.length!=x.length)
s3=dup(x);else
copy_(s3,x);for(k1=y.length-1;k1>0&!y[k1];k1--);if(y[k1]==0){copyInt_(x,1);return;}
for(k2=1<<(bpe-1);k2&&!(y[k1]&k2);k2>>=1);for(;;){if(!(k2>>=1)){k1--;if(k1<0){mont_(x,one,n,np);return;}
k2=1<<(bpe-1);}
mont_(x,x,n,np);if(k2&y[k1])
mont_(x,s3,n,np);}}
function mont_(x,y,n,np){var i,j,c,ui,t,ks;var kn=n.length;var ky=y.length;if(sa.length!=kn)
sa=new Array(kn);copyInt_(sa,0);for(;kn>0&&n[kn-1]==0;kn--);for(;ky>0&&y[ky-1]==0;ky--);ks=sa.length-1;for(i=0;i<kn;i++){t=sa[0]+x[i]*y[0];ui=((t&mask)*np)&mask;c=(t+ui*n[0])>>bpe;t=x[i];j=1;for(;j<ky-4;){c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;}
for(;j<ky;){c+=sa[j]+ui*n[j]+t*y[j];sa[j-1]=c&mask;c>>=bpe;j++;}
for(;j<kn-4;){c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;}
for(;j<kn;){c+=sa[j]+ui*n[j];sa[j-1]=c&mask;c>>=bpe;j++;}
for(;j<ks;){c+=sa[j];sa[j-1]=c&mask;c>>=bpe;j++;}
sa[j-1]=c&mask;}
if(!greater(n,sa))
sub_(sa,n);copy_(x,sa);}
(function(pool,math,width,chunks,significance,overflow,startdenom){math['seedrandom']=function seedrandom(seed,use_entropy){var key=[];var arc4;seed=mixkey(flatten(use_entropy?[seed,pool]:arguments.length?seed:[new Date().getTime(),pool,window],3),key);arc4=new ARC4(key);mixkey(arc4.S,pool);math['random']=function random(){var n=arc4.g(chunks);var d=startdenom;var x=0;while(n<significance){n=(n+x)*width;d*=width;x=arc4.g(1);}
while(n>=overflow){n/=2;d/=2;x>>>=1;}
return(n+x)/d;};return seed;};function ARC4(key){var t,u,me=this,keylen=key.length;var i=0,j=me.i=me.j=me.m=0;me.S=[];me.c=[];if(!keylen){key=[keylen++];}
while(i<width){me.S[i]=i++;}
for(i=0;i<width;i++){t=me.S[i];j=lowbits(j+t+key[i%keylen]);u=me.S[j];me.S[i]=u;me.S[j]=t;}
me.g=function getnext(count){var s=me.S;var i=lowbits(me.i+1);var t=s[i];var j=lowbits(me.j+t);var u=s[j];s[i]=u;s[j]=t;var r=s[lowbits(t+u)];while(--count){i=lowbits(i+1);t=s[i];j=lowbits(j+t);u=s[j];s[i]=u;s[j]=t;r=r*width+s[lowbits(t+u)];}
me.i=i;me.j=j;return r;};me.g(width);}
function flatten(obj,depth,result,prop,typ){result=[];typ=typeof(obj);if(depth&&typ=='object'){for(prop in obj){if(prop.indexOf('S')<5){try{result.push(flatten(obj[prop],depth-1));}catch(e){}}}}
return(result.length?result:obj+(typ!='string'?'\0':''));}
function mixkey(seed,key,smear,j){seed+='';smear=0;for(j=0;j<seed.length;j++){key[lowbits(j)]=lowbits((smear^=key[lowbits(j)]*19)+seed.charCodeAt(j));}
seed='';for(j in key){seed+=String.fromCharCode(key[j]);}
return seed;}
function lowbits(n){return n&(width-1);}
startdenom=math.pow(width,chunks);significance=math.pow(2,significance);overflow=significance*2;mixkey(math.random(),pool);})([],Math,256,6,52);if(typeof Crypto=="undefined"||!Crypto.util)
{(function(){var base64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var Crypto=window.Crypto={};var util=Crypto.util={rotl:function(n,b){return(n<<b)|(n>>>(32-b));},rotr:function(n,b){return(n<<(32-b))|(n>>>b);},endian:function(n){if(n.constructor==Number){return util.rotl(n,8)&0x00FF00FF|util.rotl(n,24)&0xFF00FF00;}
for(var i=0;i<n.length;i++)
n[i]=util.endian(n[i]);return n;},randomBytes:function(n){for(var bytes=[];n>0;n--)
bytes.push(Math.floor(Math.random()*256));return bytes;},bytesToWords:function(bytes){for(var words=[],i=0,b=0;i<bytes.length;i++,b+=8)
words[b>>>5]|=(bytes[i]&0xFF)<<(24-b%32);return words;},wordsToBytes:function(words){for(var bytes=[],b=0;b<words.length*32;b+=8)
bytes.push((words[b>>>5]>>>(24-b%32))&0xFF);return bytes;},bytesToHex:function(bytes){for(var hex=[],i=0;i<bytes.length;i++){hex.push((bytes[i]>>>4).toString(16));hex.push((bytes[i]&0xF).toString(16));}
return hex.join("");},hexToBytes:function(hex){for(var bytes=[],c=0;c<hex.length;c+=2)
bytes.push(parseInt(hex.substr(c,2),16));return bytes;},bytesToBase64:function(bytes){if(typeof btoa=="function")return btoa(Binary.bytesToString(bytes));for(var base64=[],i=0;i<bytes.length;i+=3){var triplet=(bytes[i]<<16)|(bytes[i+1]<<8)|bytes[i+2];for(var j=0;j<4;j++){if(i*8+j*6<=bytes.length*8)
base64.push(base64map.charAt((triplet>>>6*(3-j))&0x3F));else base64.push("=");}}
return base64.join("");},base64ToBytes:function(base64){if(typeof atob=="function")return Binary.stringToBytes(atob(base64));base64=base64.replace(/[^A-Z0-9+\/]/ig,"");for(var bytes=[],i=0,imod4=0;i<base64.length;imod4=++i%4){if(imod4==0)continue;bytes.push(((base64map.indexOf(base64.charAt(i-1))&(Math.pow(2,-2*imod4+8)-1))<<(imod4*2))|(base64map.indexOf(base64.charAt(i))>>>(6-imod4*2)));}
return bytes;}};var charenc=Crypto.charenc={};var UTF8=charenc.UTF8={stringToBytes:function(str){return Binary.stringToBytes(unescape(encodeURIComponent(str)));},bytesToString:function(bytes){return decodeURIComponent(escape(Binary.bytesToString(bytes)));}};var Binary=charenc.Binary={stringToBytes:function(str){for(var bytes=[],i=0;i<str.length;i++)
bytes.push(str.charCodeAt(i)&0xFF);return bytes;},bytesToString:function(bytes){for(var str=[],i=0;i<bytes.length;i++)
str.push(String.fromCharCode(bytes[i]));return str.join("");}};})();}
(function(){var C=Crypto,util=C.util,charenc=C.charenc,UTF8=charenc.UTF8;var SBOX=[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];for(var INVSBOX=[],i=0;i<256;i++)INVSBOX[SBOX[i]]=i;var MULT2=[],MULT3=[],MULT9=[],MULTB=[],MULTD=[],MULTE=[];function xtime(a,b){for(var result=0,i=0;i<8;i++){if(b&1)result^=a;var hiBitSet=a&0x80;a=(a<<1)&0xFF;if(hiBitSet)a^=0x1b;b>>>=1;}
return result;}
for(var i=0;i<256;i++){MULT2[i]=xtime(i,2);MULT3[i]=xtime(i,3);MULT9[i]=xtime(i,9);MULTB[i]=xtime(i,0xB);MULTD[i]=xtime(i,0xD);MULTE[i]=xtime(i,0xE);}
var RCON=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];var state=[[],[],[],[]],keylength,nrounds,keyschedule;var AES=C.AES={encrypt:function(message,password,options){options=options||{};var mode=options.mode||new C.mode.OFB;if(mode.fixOptions)mode.fixOptions(options);var
m=(message.constructor==String?UTF8.stringToBytes(message):message),iv=options.iv||util.randomBytes(AES._blocksize*4),k=(password.constructor==String?C.PBKDF2(password,iv,32,{asBytes:true}):password);AES._init(k);mode.encrypt(AES,m,iv);m=options.iv?m:iv.concat(m);return(options&&options.asBytes)?m:util.bytesToBase64(m);},decrypt:function(ciphertext,password,options){options=options||{};var mode=options.mode||new C.mode.OFB;if(mode.fixOptions)mode.fixOptions(options);var
c=(ciphertext.constructor==String?util.base64ToBytes(ciphertext):ciphertext),iv=options.iv||c.splice(0,AES._blocksize*4),k=(password.constructor==String?C.PBKDF2(password,iv,32,{asBytes:true}):password);AES._init(k);mode.decrypt(AES,c,iv);return(options&&options.asBytes)?c:UTF8.bytesToString(c);},_blocksize:4,_encryptblock:function(m,offset){for(var row=0;row<AES._blocksize;row++){for(var col=0;col<4;col++)
state[row][col]=m[offset+col*4+row];}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[col][row];}
for(var round=1;round<nrounds;round++){for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]=SBOX[state[row][col]];}
state[1].push(state[1].shift());state[2].push(state[2].shift());state[2].push(state[2].shift());state[3].unshift(state[3].pop());for(var col=0;col<4;col++){var s0=state[0][col],s1=state[1][col],s2=state[2][col],s3=state[3][col];state[0][col]=MULT2[s0]^MULT3[s1]^s2^s3;state[1][col]=s0^MULT2[s1]^MULT3[s2]^s3;state[2][col]=s0^s1^MULT2[s2]^MULT3[s3];state[3][col]=MULT3[s0]^s1^s2^MULT2[s3];}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[round*4+col][row];}}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]=SBOX[state[row][col]];}
state[1].push(state[1].shift());state[2].push(state[2].shift());state[2].push(state[2].shift());state[3].unshift(state[3].pop());for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[nrounds*4+col][row];}
for(var row=0;row<AES._blocksize;row++){for(var col=0;col<4;col++)
m[offset+col*4+row]=state[row][col];}},_decryptblock:function(c,offset){for(var row=0;row<AES._blocksize;row++){for(var col=0;col<4;col++)
state[row][col]=c[offset+col*4+row];}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[nrounds*4+col][row];}
for(var round=1;round<nrounds;round++){state[1].unshift(state[1].pop());state[2].push(state[2].shift());state[2].push(state[2].shift());state[3].push(state[3].shift());for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]=INVSBOX[state[row][col]];}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[(nrounds-round)*4+col][row];}
for(var col=0;col<4;col++){var s0=state[0][col],s1=state[1][col],s2=state[2][col],s3=state[3][col];state[0][col]=MULTE[s0]^MULTB[s1]^MULTD[s2]^MULT9[s3];state[1][col]=MULT9[s0]^MULTE[s1]^MULTB[s2]^MULTD[s3];state[2][col]=MULTD[s0]^MULT9[s1]^MULTE[s2]^MULTB[s3];state[3][col]=MULTB[s0]^MULTD[s1]^MULT9[s2]^MULTE[s3];}}
state[1].unshift(state[1].pop());state[2].push(state[2].shift());state[2].push(state[2].shift());state[3].push(state[3].shift());for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]=INVSBOX[state[row][col]];}
for(var row=0;row<4;row++){for(var col=0;col<4;col++)
state[row][col]^=keyschedule[col][row];}
for(var row=0;row<AES._blocksize;row++){for(var col=0;col<4;col++)
c[offset+col*4+row]=state[row][col];}},_init:function(k){keylength=k.length/4;nrounds=keylength+6;AES._keyexpansion(k);},_keyexpansion:function(k){keyschedule=[];for(var row=0;row<keylength;row++){keyschedule[row]=[k[row*4],k[row*4+1],k[row*4+2],k[row*4+3]];}
for(var row=keylength;row<AES._blocksize*(nrounds+1);row++){var temp=[keyschedule[row-1][0],keyschedule[row-1][1],keyschedule[row-1][2],keyschedule[row-1][3]];if(row%keylength==0){temp.push(temp.shift());temp[0]=SBOX[temp[0]];temp[1]=SBOX[temp[1]];temp[2]=SBOX[temp[2]];temp[3]=SBOX[temp[3]];temp[0]^=RCON[row/keylength];}else if(keylength>6&&row%keylength==4){temp[0]=SBOX[temp[0]];temp[1]=SBOX[temp[1]];temp[2]=SBOX[temp[2]];temp[3]=SBOX[temp[3]];}
keyschedule[row]=[keyschedule[row-keylength][0]^temp[0],keyschedule[row-keylength][1]^temp[1],keyschedule[row-keylength][2]^temp[2],keyschedule[row-keylength][3]^temp[3]];}}};})();(function(C){var C_pad=C.pad={};function _requiredPadding(cipher,message){var blockSizeInBytes=cipher._blocksize*4;var reqd=blockSizeInBytes-message.length%blockSizeInBytes;return reqd;};var _unpadLength=function(message){var pad=message.pop();for(var i=1;i<pad;i++){message.pop();}};C_pad.NoPadding={pad:function(cipher,message){},unpad:function(message){}};C_pad.ZeroPadding={pad:function(cipher,message){var blockSizeInBytes=cipher._blocksize*4;var reqd=message.length%blockSizeInBytes;if(reqd!=0){for(reqd=blockSizeInBytes-reqd;reqd>0;reqd--){message.push(0x00);}}},unpad:function(message){}};C_pad.iso7816={pad:function(cipher,message){var reqd=_requiredPadding(cipher,message);message.push(0x80);for(;reqd>1;reqd--){message.push(0x00);}},unpad:function(message){while(message.pop()!=0x80){}}};C_pad.ansix923={pad:function(cipher,message){var reqd=_requiredPadding(cipher,message);for(var i=1;i<reqd;i++){message.push(0x00);}
message.push(reqd);},unpad:_unpadLength};C_pad.iso10126={pad:function(cipher,message){var reqd=_requiredPadding(cipher,message);for(var i=1;i<reqd;i++){message.push(Math.floor(Math.random()*256));}
message.push(reqd);},unpad:_unpadLength};C_pad.pkcs7={pad:function(cipher,message){var reqd=_requiredPadding(cipher,message);for(var i=0;i<reqd;i++){message.push(reqd);}},unpad:_unpadLength};var C_mode=C.mode={};var Mode=C_mode.Mode=function(padding){if(padding){this._padding=padding;}};Mode.prototype={encrypt:function(cipher,m,iv){this._padding.pad(cipher,m);this._doEncrypt(cipher,m,iv);},decrypt:function(cipher,m,iv){this._doDecrypt(cipher,m,iv);this._padding.unpad(m);},_padding:C_pad.iso7816};var ECB=C_mode.ECB=function(){Mode.apply(this,arguments);};var ECB_prototype=ECB.prototype=new Mode;ECB_prototype._doEncrypt=function(cipher,m,iv){var blockSizeInBytes=cipher._blocksize*4;for(var offset=0;offset<m.length;offset+=blockSizeInBytes){cipher._encryptblock(m,offset);}};ECB_prototype._doDecrypt=function(cipher,c,iv){var blockSizeInBytes=cipher._blocksize*4;for(var offset=0;offset<c.length;offset+=blockSizeInBytes){cipher._decryptblock(c,offset);}};ECB_prototype.fixOptions=function(options){options.iv=[];};var CBC=C_mode.CBC=function(){Mode.apply(this,arguments);};var CBC_prototype=CBC.prototype=new Mode;CBC_prototype._doEncrypt=function(cipher,m,iv){var blockSizeInBytes=cipher._blocksize*4;for(var offset=0;offset<m.length;offset+=blockSizeInBytes){if(offset==0){for(var i=0;i<blockSizeInBytes;i++)
m[i]^=iv[i];}else{for(var i=0;i<blockSizeInBytes;i++)
m[offset+i]^=m[offset+i-blockSizeInBytes];}
cipher._encryptblock(m,offset);}};CBC_prototype._doDecrypt=function(cipher,c,iv){var blockSizeInBytes=cipher._blocksize*4;var prevCryptedBlock=iv;for(var offset=0;offset<c.length;offset+=blockSizeInBytes){var thisCryptedBlock=c.slice(offset,offset+blockSizeInBytes);cipher._decryptblock(c,offset);for(var i=0;i<blockSizeInBytes;i++){c[offset+i]^=prevCryptedBlock[i];}
prevCryptedBlock=thisCryptedBlock;}};var CFB=C_mode.CFB=function(){Mode.apply(this,arguments);};var CFB_prototype=CFB.prototype=new Mode;CFB_prototype._padding=C_pad.NoPadding;CFB_prototype._doEncrypt=function(cipher,m,iv){var blockSizeInBytes=cipher._blocksize*4,keystream=iv.slice(0);for(var i=0;i<m.length;i++){var j=i%blockSizeInBytes;if(j==0)cipher._encryptblock(keystream,0);m[i]^=keystream[j];keystream[j]=m[i];}};CFB_prototype._doDecrypt=function(cipher,c,iv){var blockSizeInBytes=cipher._blocksize*4,keystream=iv.slice(0);for(var i=0;i<c.length;i++){var j=i%blockSizeInBytes;if(j==0)cipher._encryptblock(keystream,0);var b=c[i];c[i]^=keystream[j];keystream[j]=b;}};var OFB=C_mode.OFB=function(){Mode.apply(this,arguments);};var OFB_prototype=OFB.prototype=new Mode;OFB_prototype._padding=C_pad.NoPadding;OFB_prototype._doEncrypt=function(cipher,m,iv){var blockSizeInBytes=cipher._blocksize*4,keystream=iv.slice(0);for(var i=0;i<m.length;i++){if(i%blockSizeInBytes==0)
cipher._encryptblock(keystream,0);m[i]^=keystream[i%blockSizeInBytes];}};OFB_prototype._doDecrypt=OFB_prototype._doEncrypt;var CTR=C_mode.CTR=function(){Mode.apply(this,arguments);};var CTR_prototype=CTR.prototype=new Mode;CTR_prototype._padding=C_pad.NoPadding;CTR_prototype._doEncrypt=function(cipher,m,iv){var blockSizeInBytes=cipher._blocksize*4;var counter=iv.slice(0);for(var i=0;i<m.length;){var keystream=counter.slice(0);cipher._encryptblock(keystream,0);for(var j=0;i<m.length&&j<blockSizeInBytes;j++,i++){m[i]^=keystream[j];}
if(++(counter[blockSizeInBytes-1])==256){counter[blockSizeInBytes-1]=0;if(++(counter[blockSizeInBytes-2])==256){counter[blockSizeInBytes-2]=0;if(++(counter[blockSizeInBytes-3])==256){counter[blockSizeInBytes-3]=0;++(counter[blockSizeInBytes-4]);}}}}};CTR_prototype._doDecrypt=CTR_prototype._doEncrypt;})(Crypto);(function(){var C=Crypto,util=C.util,charenc=C.charenc,UTF8=charenc.UTF8,Binary=charenc.Binary;C.HMAC=function(hasher,message,key,options){if(message.constructor==String)message=UTF8.stringToBytes(message);if(key.constructor==String)key=UTF8.stringToBytes(key);if(key.length>hasher._blocksize*4)
key=hasher(key,{asBytes:true});var okey=key.slice(0),ikey=key.slice(0);for(var i=0;i<hasher._blocksize*4;i++){okey[i]^=0x5C;ikey[i]^=0x36;}
var hmacbytes=hasher(okey.concat(hasher(ikey.concat(message),{asBytes:true})),{asBytes:true});return options&&options.asBytes?hmacbytes:options&&options.asString?Binary.bytesToString(hmacbytes):util.bytesToHex(hmacbytes);};})();(function(){var C=Crypto,util=C.util,charenc=C.charenc,UTF8=charenc.UTF8,Binary=charenc.Binary;var K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];var SHA256=C.SHA256=function(message,options){var digestbytes=util.wordsToBytes(SHA256._sha256(message));return options&&options.asBytes?digestbytes:options&&options.asString?Binary.bytesToString(digestbytes):util.bytesToHex(digestbytes);};SHA256._sha256=function(message){if(message.constructor==String)message=UTF8.stringToBytes(message);var m=util.bytesToWords(message),l=message.length*8,H=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19],w=[],a,b,c,d,e,f,g,h,i,j,t1,t2;m[l>>5]|=0x80<<(24-l%32);m[((l+64>>9)<<4)+15]=l;for(var i=0;i<m.length;i+=16){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(var j=0;j<64;j++){if(j<16)w[j]=m[j+i];else{var gamma0x=w[j-15],gamma1x=w[j-2],gamma0=((gamma0x<<25)|(gamma0x>>>7))^((gamma0x<<14)|(gamma0x>>>18))^(gamma0x>>>3),gamma1=((gamma1x<<15)|(gamma1x>>>17))^((gamma1x<<13)|(gamma1x>>>19))^(gamma1x>>>10);w[j]=gamma0+(w[j-7]>>>0)+
gamma1+(w[j-16]>>>0);}
var ch=e&f^~e&g,maj=a&b^a&c^b&c,sigma0=((a<<30)|(a>>>2))^((a<<19)|(a>>>13))^((a<<10)|(a>>>22)),sigma1=((e<<26)|(e>>>6))^((e<<21)|(e>>>11))^((e<<7)|(e>>>25));t1=(h>>>0)+sigma1+ch+(K[j])+(w[j]>>>0);t2=sigma0+maj;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
H[0]+=a;H[1]+=b;H[2]+=c;H[3]+=d;H[4]+=e;H[5]+=f;H[6]+=g;H[7]+=h;}
return H;};SHA256._blocksize=16;SHA256._digestsize=32;})();var hexcase=0;var b64pad="";function hex_sha512(s){return rstr2hex(rstr_sha512(str2rstr_utf8(s)));}
function b64_sha512(s){return rstr2b64(rstr_sha512(str2rstr_utf8(s)));}
function any_sha512(s,e){return rstr2any(rstr_sha512(str2rstr_utf8(s)),e);}
function hex_hmac_sha512(k,d)
{return rstr2hex(rstr_hmac_sha512(str2rstr_utf8(k),str2rstr_utf8(d)));}
function b64_hmac_sha512(k,d)
{return rstr2b64(rstr_hmac_sha512(str2rstr_utf8(k),str2rstr_utf8(d)));}
function any_hmac_sha512(k,d,e)
{return rstr2any(rstr_hmac_sha512(str2rstr_utf8(k),str2rstr_utf8(d)),e);}
function sha512_vm_test()
{return hex_sha512("abc").toLowerCase()=="ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a"+"2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f";}
function rstr_sha512(s)
{return binb2rstr(binb_sha512(rstr2binb(s),s.length*8));}
function rstr_hmac_sha512(key,data)
{var bkey=rstr2binb(key);if(bkey.length>32)bkey=binb_sha512(bkey,key.length*8);var ipad=Array(32),opad=Array(32);for(var i=0;i<32;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=binb_sha512(ipad.concat(rstr2binb(data)),1024+data.length*8);return binb2rstr(binb_sha512(opad.concat(hash),1024+512));}
function rstr2hex(input)
{try{hexcase}catch(e){hexcase=0;}
var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++)
{x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)
+hex_tab.charAt(x&0x0F);}
return output;}
function rstr2b64(input)
{try{b64pad}catch(e){b64pad='';}
var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var output="";var len=input.length;for(var i=0;i<len;i+=3)
{var triplet=(input.charCodeAt(i)<<16)|(i+1<len?input.charCodeAt(i+1)<<8:0)|(i+2<len?input.charCodeAt(i+2):0);for(var j=0;j<4;j++)
{if(i*8+j*6>input.length*8)output+=b64pad;else output+=tab.charAt((triplet>>>6*(3-j))&0x3F);}}
return output;}
function rstr2any(input,encoding)
{var divisor=encoding.length;var i,j,q,x,quotient;var dividend=Array(Math.ceil(input.length/2));for(i=0;i<dividend.length;i++)
{dividend[i]=(input.charCodeAt(i*2)<<8)|input.charCodeAt(i*2+1);}
var full_length=Math.ceil(input.length*8/(Math.log(encoding.length)/Math.log(2)));var remainders=Array(full_length);for(j=0;j<full_length;j++)
{quotient=Array();x=0;for(i=0;i<dividend.length;i++)
{x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)
quotient[quotient.length]=q;}
remainders[j]=x;dividend=quotient;}
var output="";for(i=remainders.length-1;i>=0;i--)
output+=encoding.charAt(remainders[i]);return output;}
function str2rstr_utf8(input)
{var output="";var i=-1;var x,y;while(++i<input.length)
{x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF)
{x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}
if(x<=0x7F)
output+=String.fromCharCode(x);else if(x<=0x7FF)
output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)
output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)
output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}
return output;}
function str2rstr_utf16le(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;}
function str2rstr_utf16be(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;}
function rstr2binb(input)
{var output=Array(input.length>>2);for(var i=0;i<output.length;i++)
output[i]=0;for(var i=0;i<input.length*8;i+=8)
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(24-i%32);return output;}
function binb2rstr(input)
{var output="";for(var i=0;i<input.length*32;i+=8)
output+=String.fromCharCode((input[i>>5]>>>(24-i%32))&0xFF);return output;}
var sha512_k;function binb_sha512(x,len)
{if(sha512_k==undefined)
{sha512_k=new Array(new int64(0x428a2f98,-685199838),new int64(0x71374491,0x23ef65cd),new int64(-1245643825,-330482897),new int64(-373957723,-2121671748),new int64(0x3956c25b,-213338824),new int64(0x59f111f1,-1241133031),new int64(-1841331548,-1357295717),new int64(-1424204075,-630357736),new int64(-670586216,-1560083902),new int64(0x12835b01,0x45706fbe),new int64(0x243185be,0x4ee4b28c),new int64(0x550c7dc3,-704662302),new int64(0x72be5d74,-226784913),new int64(-2132889090,0x3b1696b1),new int64(-1680079193,0x25c71235),new int64(-1046744716,-815192428),new int64(-459576895,-1628353838),new int64(-272742522,0x384f25e3),new int64(0xfc19dc6,-1953704523),new int64(0x240ca1cc,0x77ac9c65),new int64(0x2de92c6f,0x592b0275),new int64(0x4a7484aa,0x6ea6e483),new int64(0x5cb0a9dc,-1119749164),new int64(0x76f988da,-2096016459),new int64(-1740746414,-295247957),new int64(-1473132947,0x2db43210),new int64(-1341970488,-1728372417),new int64(-1084653625,-1091629340),new int64(-958395405,0x3da88fc2),new int64(-710438585,-1828018395),new int64(0x6ca6351,-536640913),new int64(0x14292967,0xa0e6e70),new int64(0x27b70a85,0x46d22ffc),new int64(0x2e1b2138,0x5c26c926),new int64(0x4d2c6dfc,0x5ac42aed),new int64(0x53380d13,-1651133473),new int64(0x650a7354,-1951439906),new int64(0x766a0abb,0x3c77b2a8),new int64(-2117940946,0x47edaee6),new int64(-1838011259,0x1482353b),new int64(-1564481375,0x4cf10364),new int64(-1474664885,-1136513023),new int64(-1035236496,-789014639),new int64(-949202525,0x654be30),new int64(-778901479,-688958952),new int64(-694614492,0x5565a910),new int64(-200395387,0x5771202a),new int64(0x106aa070,0x32bbd1b8),new int64(0x19a4c116,-1194143544),new int64(0x1e376c08,0x5141ab53),new int64(0x2748774c,-544281703),new int64(0x34b0bcb5,-509917016),new int64(0x391c0cb3,-976659869),new int64(0x4ed8aa4a,-482243893),new int64(0x5b9cca4f,0x7763e373),new int64(0x682e6ff3,-692930397),new int64(0x748f82ee,0x5defb2fc),new int64(0x78a5636f,0x43172f60),new int64(-2067236844,-1578062990),new int64(-1933114872,0x1a6439ec),new int64(-1866530822,0x23631e28),new int64(-1538233109,-561857047),new int64(-1090935817,-1295615723),new int64(-965641998,-479046869),new int64(-903397682,-366583396),new int64(-779700025,0x21c0c207),new int64(-354779690,-840897762),new int64(-176337025,-294727304),new int64(0x6f067aa,0x72176fba),new int64(0xa637dc5,-1563912026),new int64(0x113f9804,-1090974290),new int64(0x1b710b35,0x131c471b),new int64(0x28db77f5,0x23047d84),new int64(0x32caab7b,0x40c72493),new int64(0x3c9ebe0a,0x15c9bebc),new int64(0x431d67c4,-1676669620),new int64(0x4cc5d4be,-885112138),new int64(0x597f299c,-60457430),new int64(0x5fcb6fab,0x3ad6faec),new int64(0x6c44198c,0x4a475817));}
var H=new Array(new int64(0x6a09e667,-205731576),new int64(-1150833019,-2067093701),new int64(0x3c6ef372,-23791573),new int64(-1521486534,0x5f1d36f1),new int64(0x510e527f,-1377402159),new int64(-1694144372,0x2b3e6c1f),new int64(0x1f83d9ab,-79577749),new int64(0x5be0cd19,0x137e2179));var T1=new int64(0,0),T2=new int64(0,0),a=new int64(0,0),b=new int64(0,0),c=new int64(0,0),d=new int64(0,0),e=new int64(0,0),f=new int64(0,0),g=new int64(0,0),h=new int64(0,0),s0=new int64(0,0),s1=new int64(0,0),Ch=new int64(0,0),Maj=new int64(0,0),r1=new int64(0,0),r2=new int64(0,0),r3=new int64(0,0);var j,i;var W=new Array(80);for(i=0;i<80;i++)
W[i]=new int64(0,0);x[len>>5]|=0x80<<(24-(len&0x1f));x[((len+128>>10)<<5)+31]=len;for(i=0;i<x.length;i+=32)
{int64copy(a,H[0]);int64copy(b,H[1]);int64copy(c,H[2]);int64copy(d,H[3]);int64copy(e,H[4]);int64copy(f,H[5]);int64copy(g,H[6]);int64copy(h,H[7]);for(j=0;j<16;j++)
{W[j].h=x[i+2*j];W[j].l=x[i+2*j+1];}
for(j=16;j<80;j++)
{int64rrot(r1,W[j-2],19);int64revrrot(r2,W[j-2],29);int64shr(r3,W[j-2],6);s1.l=r1.l^r2.l^r3.l;s1.h=r1.h^r2.h^r3.h;int64rrot(r1,W[j-15],1);int64rrot(r2,W[j-15],8);int64shr(r3,W[j-15],7);s0.l=r1.l^r2.l^r3.l;s0.h=r1.h^r2.h^r3.h;int64add4(W[j],s1,W[j-7],s0,W[j-16]);}
for(j=0;j<80;j++)
{Ch.l=(e.l&f.l)^(~e.l&g.l);Ch.h=(e.h&f.h)^(~e.h&g.h);int64rrot(r1,e,14);int64rrot(r2,e,18);int64revrrot(r3,e,9);s1.l=r1.l^r2.l^r3.l;s1.h=r1.h^r2.h^r3.h;int64rrot(r1,a,28);int64revrrot(r2,a,2);int64revrrot(r3,a,7);s0.l=r1.l^r2.l^r3.l;s0.h=r1.h^r2.h^r3.h;Maj.l=(a.l&b.l)^(a.l&c.l)^(b.l&c.l);Maj.h=(a.h&b.h)^(a.h&c.h)^(b.h&c.h);int64add5(T1,h,s1,Ch,sha512_k[j],W[j]);int64add(T2,s0,Maj);int64copy(h,g);int64copy(g,f);int64copy(f,e);int64add(e,d,T1);int64copy(d,c);int64copy(c,b);int64copy(b,a);int64add(a,T1,T2);}
int64add(H[0],H[0],a);int64add(H[1],H[1],b);int64add(H[2],H[2],c);int64add(H[3],H[3],d);int64add(H[4],H[4],e);int64add(H[5],H[5],f);int64add(H[6],H[6],g);int64add(H[7],H[7],h);}
var hash=new Array(16);for(i=0;i<8;i++)
{hash[2*i]=H[i].h;hash[2*i+1]=H[i].l;}
return hash;}
function int64(h,l)
{this.h=h;this.l=l;}
function int64copy(dst,src)
{dst.h=src.h;dst.l=src.l;}
function int64rrot(dst,x,shift)
{dst.l=(x.l>>>shift)|(x.h<<(32-shift));dst.h=(x.h>>>shift)|(x.l<<(32-shift));}
function int64revrrot(dst,x,shift)
{dst.l=(x.h>>>shift)|(x.l<<(32-shift));dst.h=(x.l>>>shift)|(x.h<<(32-shift));}
function int64shr(dst,x,shift)
{dst.l=(x.l>>>shift)|(x.h<<(32-shift));dst.h=(x.h>>>shift);}
function int64add(dst,x,y)
{var w0=(x.l&0xffff)+(y.l&0xffff);var w1=(x.l>>>16)+(y.l>>>16)+(w0>>>16);var w2=(x.h&0xffff)+(y.h&0xffff)+(w1>>>16);var w3=(x.h>>>16)+(y.h>>>16)+(w2>>>16);dst.l=(w0&0xffff)|(w1<<16);dst.h=(w2&0xffff)|(w3<<16);}
function int64add4(dst,a,b,c,d)
{var w0=(a.l&0xffff)+(b.l&0xffff)+(c.l&0xffff)+(d.l&0xffff);var w1=(a.l>>>16)+(b.l>>>16)+(c.l>>>16)+(d.l>>>16)+(w0>>>16);var w2=(a.h&0xffff)+(b.h&0xffff)+(c.h&0xffff)+(d.h&0xffff)+(w1>>>16);var w3=(a.h>>>16)+(b.h>>>16)+(c.h>>>16)+(d.h>>>16)+(w2>>>16);dst.l=(w0&0xffff)|(w1<<16);dst.h=(w2&0xffff)|(w3<<16);}
function int64add5(dst,a,b,c,d,e)
{var w0=(a.l&0xffff)+(b.l&0xffff)+(c.l&0xffff)+(d.l&0xffff)+(e.l&0xffff);var w1=(a.l>>>16)+(b.l>>>16)+(c.l>>>16)+(d.l>>>16)+(e.l>>>16)+(w0>>>16);var w2=(a.h&0xffff)+(b.h&0xffff)+(c.h&0xffff)+(d.h&0xffff)+(e.h&0xffff)+(w1>>>16);var w3=(a.h>>>16)+(b.h>>>16)+(c.h>>>16)+(d.h>>>16)+(e.h>>>16)+(w2>>>16);dst.l=(w0&0xffff)|(w1<<16);dst.h=(w2&0xffff)|(w3<<16);}
(function(){var Fortuna=Crypto.Fortuna=function(){};var K=0;var C=0;var ReseedCnt=0;var MinPoolSize=32;var MaxEventSize=32;var LastReseed=0;var p=0;var P=[0,0,0,0];function Reseed(s){if(!K){K=Crypto.SHA256(s);}
else{K=Crypto.SHA256(K+s);}
var d=new Date();LastReseed=d.getTime();C++;}
Fortuna.AddRandomEvent=function(e){if((e.length<0)||(e.length>MaxEventSize)){throw"Fortuna ERROR: Random event cannot be more than "+MaxEventSize+" bytes."}
for(var i=0;i!=e.length;i++){if(!P[p]){P[p]=e.substring(i,i+1);}
else{P[p]+=e.substring(i,i+1);}
p++;if(p==P.length){p=0;}}}
Fortuna.Ready=function(){if((P[0].toString().length>=MinPoolSize)||(ReseedCnt)){return 1;}
else{return 0;}}
function GenerateBlocks(k){if(C==0){throw"Fortuna ERROR: Entropy pools too empty.";}
var r=0;for(var i=0;i!=k;i++){var Cp=Crypto.SHA256(C.toString()).substring(0,16);var iv=Crypto.charenc.Binary.stringToBytes(K.substring(0,16));var c=Crypto.AES.encrypt(Cp,Crypto.util.hexToBytes(K),{mode:new Crypto.mode.CTR,iv:iv}).substring(0,16);if(!r){r=c;}
else{r+=c;}
C++;}
return r;}
function PseudoRandomData(n){if((n<=0)||(n>=1048576)||(!n)){throw"Fortuna ERROR: Invalid value.";}
var r=GenerateBlocks(Math.ceil(n/16)).substring(0,n);K=GenerateBlocks(4);return r;}
Fortuna.RandomData=function(n){var d=new Date();if((P[0].toString().length>=MinPoolSize)&&((d.getTime()-LastReseed)>100)){ReseedCnt++;var s;for(var i=0;i!=31;i++){if(((ReseedCnt/Math.pow(2,i))%1)==0){if(!s){s=Crypto.SHA256(P[i]);}
else{s+=Crypto.SHA256(P[i]);}
P[i]=0;}}
Reseed(s);}
if(ReseedCnt==0){throw"Fortuna ERROR: Entropy pools too empty.";}
else{return PseudoRandomData(n);}}})();