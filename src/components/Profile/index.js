import Avatar from "../Avatar"
import * as S from "./styled"

const Profile = () => {
  return (
    <S.ProfileWrapper>
    <S.ProfileLink>
      <Avatar />
      <S.ProfileAuthor>
        {title}
        <S.ProfilePosition>{position}</S.ProfilePosition>
      </S.ProfileAuthor>
    </S.ProfileLink>
    <S.ProfileDescription>{description}</S.ProfileDescription>
  </S.ProfileWrapper>
)
}
    export default Profile
  